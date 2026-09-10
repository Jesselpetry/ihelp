#!/usr/bin/env python3
"""
Sync OJ Problems from iJudge to ihelp and pscp-69070027 repos.
Direct headless HTTP authentication with session cookie support and historical merging.
"""

import http.cookiejar
import json
import os
import re
import sys
import time
import urllib.request

IHELP_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PSCP_ROOT = os.path.normpath(os.path.join(IHELP_ROOT, "..", "pscp-69070027"))

IHELP_JSON = os.path.join(IHELP_ROOT, "data", "oj_problems.json")
PSCP_JSON = os.path.join(PSCP_ROOT, "oj_problems.json")
CONFIG_FILE = os.path.join(PSCP_ROOT, "submit_config.json")

DEFAULT_USER = "it69070027"
DEFAULT_PASS = "Jess1212312121"
SIGNIN_ACTION_ID = "7f151777b5ab2e8348f2efaa6a76d5128cb6e64a71"

MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

def format_expire_date(iso_str):
    if not iso_str:
        return ""
    m = re.match(r"^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})", iso_str)
    if not m:
        return iso_str
    year, month_num, day, hour, minute = m.groups()
    month_name = MONTH_NAMES[int(month_num) - 1]
    return f"{int(day)} {month_name} {year}, {hour}:{minute}"

def get_week(item):
    pid = item["id"]
    name = item.get("name", "")
    exp = item.get("expire_date", "")
    
    if "9 October" in exp or (3349 <= pid <= 3363):
        return 9
    if "25 September" in exp or (3290 <= pid <= 3301):
        return 8
    if item.get("is_midterm") or "[ MIDTERM ]" in name.upper() or (3274 <= pid <= 3282):
        return 7
    if "11 September" in exp or (3226 <= pid <= 3238):
        return 6
    if "4 September" in exp or pid in [3129, 3135] or (3155 <= pid <= 3167):
        return 5
    if "28 August" in exp or (3058 <= pid <= 3116):
        if pid <= 3072:
            return 3
        else:
            return 4
    if "14 August" in exp or "16 August" in exp or "17 August" in exp or (3020 <= pid <= 3042):
        return 2
    if "31 July" in exp or "7 August" in exp or pid <= 3019:
        return 1
    return 1

class NoRedirectHandler(urllib.request.HTTPRedirectHandler):
    def http_error_303(self, req, fp, code, msg, headers):
        return fp

def login_ijudge(username=DEFAULT_USER, password=DEFAULT_PASS):
    cj = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj), NoRedirectHandler)

    payload = json.dumps([username, password, "/"]).encode("utf-8")
    req = urllib.request.Request(
        "https://ijudge.it.kmitl.ac.th/signin",
        data=payload,
        headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:153.0) Gecko/20100101 Firefox/153.0",
            "Accept": "text/x-component",
            "Content-Type": "text/plain;charset=UTF-8",
            "Next-Action": SIGNIN_ACTION_ID,
            "Origin": "https://ijudge.it.kmitl.ac.th",
            "Referer": "https://ijudge.it.kmitl.ac.th/signin",
            "Connection": "close"
        }
    )
    opener.open(req)
    for c in cj:
        if c.name == "access_token":
            return f"access_token={c.value}"
    return None

def resolve_cookie():
    env_c = os.environ.get("IJUDGE_COOKIE")
    if env_c and env_c.strip():
        return env_c.strip()

    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                c_conf = json.load(f).get("cookie", "").strip()
                if c_conf:
                    return c_conf
        except Exception:
            pass

    username = os.environ.get("IJUDGE_USER", DEFAULT_USER)
    password = os.environ.get("IJUDGE_PASS", DEFAULT_PASS)
    print(f"[*] Logging in to iJudge as {username}...")
    token_cookie = login_ijudge(username, password)
    if token_cookie:
        print("    ✅ Authentication successful!")
        try:
            cfg = {}
            if os.path.exists(CONFIG_FILE):
                with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                    cfg = json.load(f)
            cfg["cookie"] = token_cookie
            with open(CONFIG_FILE, "w", encoding="utf-8") as f:
                json.dump(cfg, f, indent=2, ensure_ascii=False)
        except Exception:
            pass
        return token_cookie
    raise RuntimeError("Failed to log in to iJudge.")

def fetch_problems_rsc(cookie):
    url = "https://ijudge.it.kmitl.ac.th/courses/78/problems?page=0"
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:153.0) Gecko/20100101 Firefox/153.0",
        "Cookie": cookie,
        "RSC": "1",
        "Connection": "close"
    }
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=15) as resp:
        rsc = resp.read().decode("utf-8")

    idx = rsc.find('{"problems":[')
    if idx == -1:
        raise RuntimeError("No problems array in Course 78 RSC stream.")

    arr_start = idx + len('{"problems":')
    depth = 0
    arr_end = -1
    for i in range(arr_start, len(rsc)):
        if rsc[i] == "[":
            depth += 1
        elif rsc[i] == "]":
            depth -= 1
            if depth == 0:
                arr_end = i + 1
                break

    return json.loads(rsc[arr_start:arr_end])

def main():
    cookie = resolve_cookie()
    
    # Load existing problems
    existing_map = {}
    master_source = IHELP_JSON if os.path.exists(IHELP_JSON) else PSCP_JSON
    if os.path.exists(master_source):
        with open(master_source, "r", encoding="utf-8") as f:
            for p in json.load(f):
                existing_map[p["id"]] = p
                
    print(f"Existing problem count before sync: {len(existing_map)}")

    raw_problems = fetch_problems_rsc(cookie)
    print(f"Fetched {len(raw_problems)} active problems from Course 78.")

    new_count = 0
    for idx_p, p in enumerate(raw_problems):
        pid = p["cp_id"]
        p_name = p.get("cp_title", "")
        status_val = p.get("status", "")
        attempted = p.get("attempted", 0)
        passed = p.get("passed", 0)
        percentage = round((passed / attempted * 100), 2) if attempted > 0 else 0.0
        expire_str = format_expire_date(p.get("cp_expired_time", ""))

        is_ll = "[LEARNING LOG" in p_name.upper()
        is_rec = "[RECOMMEND" in p_name.upper()
        is_midterm = "[ MIDTERM ]" in p_name.upper() or (3274 <= pid <= 3282)

        # Preserve historical recommend
        if pid in existing_map and existing_map[pid].get("is_recommended"):
            is_rec = True
            if "[recommend]" not in p_name.lower():
                p_name = f"[Recommend] {p_name}"

        if status_val == "PASSED":
            status = "Passed"
        elif attempted > 0:
            status = "Not Passed"
        else:
            status = "Not Submit"

        page_num = idx_p // 10
        item = {
            "id": pid,
            "name": p_name,
            "status": status,
            "difficulty": p.get("problem_level", 0),
            "passed_count": passed,
            "attempt_count": attempted,
            "percentage": percentage,
            "expire_date": expire_str,
            "is_learning_log": is_ll,
            "is_recommended": is_rec,
            "is_midterm": is_midterm,
            "url": f"https://ijudge.it.kmitl.ac.th/problems/{pid}/description?problemPage={page_num}"
        }
        item["week"] = get_week(item)

        if pid not in existing_map:
            new_count += 1
            print(f"  + New OJ {pid}: {p_name} | Expire: {expire_str} | W{item['week']}")

        existing_map[pid] = item

    sorted_problems = sorted(existing_map.values(), key=lambda x: x["id"])
    print(f"Total problems after sync: {len(sorted_problems)} (New added: {new_count})")

    # Save to ihelp
    if os.path.exists(os.path.dirname(IHELP_JSON)):
        with open(IHELP_JSON, "w", encoding="utf-8") as f:
            json.dump(sorted_problems, f, ensure_ascii=False, indent=2)
        print(f"Updated {IHELP_JSON}")

    # Save to pscp-69070027
    if os.path.exists(os.path.dirname(PSCP_JSON)):
        with open(PSCP_JSON, "w", encoding="utf-8") as f:
            json.dump(sorted_problems, f, ensure_ascii=False, indent=2)
        print(f"Updated {PSCP_JSON}")

if __name__ == "__main__":
    main()
