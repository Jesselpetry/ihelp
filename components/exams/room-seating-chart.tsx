"use client";

import { useState, useMemo } from "react";
import {
  Monitor,
  Armchair,
  X,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RoomSeatingSession, RoomSeatStudent } from "@/lib/exams/types";

interface RoomSeatingChartProps {
  session: RoomSeatingSession;
  mySeat?: string;
  myStudentId?: string;
  onClose?: () => void;
}

export function RoomSeatingChart({
  session,
  mySeat,
  myStudentId,
  onClose,
}: RoomSeatingChartProps) {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(mySeat || null);

  // ── Unified Classroom Grid Architecture ──
  // Columns (แนวดิ่งเรียงจากซ้ายไปขวา): A, B, C, D, E, F, G...
  // Rows (แถวแนวนอนจากหน้าห้องไปหลังห้อง): 1, 2, 3, 4, 5, 6, 7, 8, 9, 10...
  const { colLetters, maxRow } = useMemo(() => {
    let maxCharCode = "A".charCodeAt(0);
    let maxR = 10;

    Object.keys(session.seats).forEach((seat) => {
      const match = seat.match(/^([A-Za-z]+)(\d+)$/);
      if (match) {
        const letter = match[1].toUpperCase();
        const num = parseInt(match[2], 10);
        maxCharCode = Math.max(maxCharCode, letter.charCodeAt(0));
        maxR = Math.max(maxR, num);
      }
    });

    // Ensure columns cover up to at least 'F' (or 'G' if present)
    const targetCharCode = Math.max(maxCharCode, "F".charCodeAt(0));
    const cols: string[] = [];
    for (let c = "A".charCodeAt(0); c <= targetCharCode; c++) {
      cols.push(String.fromCharCode(c));
    }

    return {
      colLetters: cols,
      maxRow: Math.max(maxR, 10),
    };
  }, [session.seats]);

  // Split columns for central aisle
  const aisleColIndex = Math.ceil(colLetters.length / 2); // e.g. A, B, C | D, E, F, G
  const leftCols = colLetters.slice(0, aisleColIndex);
  const rightCols = colLetters.slice(aisleColIndex);

  const selectedStudent: RoomSeatStudent | null = useMemo(() => {
    if (!selectedSeat) return null;
    return session.seats[selectedSeat] || null;
  }, [selectedSeat, session.seats]);

  const totalSeats = Object.keys(session.seats).length;

  return (
    <div className="rounded-3xl border bg-card/95 p-3.5 sm:p-5 shadow-xs backdrop-blur-md animate-in fade-in-0 duration-300">
      {/* ── 1. Clean Non-Redundant Room Header ── */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
            <Armchair className="size-4 text-primary shrink-0" />
            <span>ผังที่นั่งห้องสอบ • ห้อง {session.room}</span>
          </h4>
          <Badge variant="secondary" className="font-medium text-xs gap-1 py-0.5 px-2.5">
            <Users className="size-3 text-muted-foreground" />
            <span>ผู้เข้าสอบในห้องนี้ {totalSeats} คน</span>
          </Badge>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          {mySeat && (
            <div className="flex items-center gap-2 rounded-full bg-primary/10 border border-primary/25 px-3 py-1 text-xs">
              <Armchair className="size-3.5 text-primary shrink-0" />
              <span className="text-muted-foreground text-[11px]">ที่นั่งของคุณ:</span>
              <span className="font-bold text-sm text-primary">{mySeat}</span>
            </div>
          )}

          {onClose && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              className="rounded-full size-8 hover:bg-muted text-muted-foreground hover:text-foreground"
              aria-label="ปิดผังที่นั่ง"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* ── 2. Blackboard / Stage (หน้าห้องสอบ • STAGE) ── */}
      <div className="mx-auto mb-4 max-w-sm sm:max-w-md text-center">
        <div className="flex h-8 items-center justify-center rounded-full bg-muted/60 border border-border/60 text-[11px] font-semibold text-muted-foreground tracking-wide gap-2 shadow-inner">
          <Monitor className="size-3.5 text-primary" />
          <span>หน้าห้องสอบ • โต๊ะอาจารย์คุมสอบ (STAGE)</span>
        </div>
      </div>

      {/* ── 3. Classroom Seating Grid (Columns A-G across, Rows 1-10 down) ── */}
      <div className="w-full overflow-x-auto pb-3 pt-1 flex justify-center scrollbar-thin touch-pan-x">
        <div className="w-fit mx-auto px-1 sm:px-3 flex flex-col items-center">
          {/* Column Letters Bar at Top (A B C | ทางเดิน | D E F G) */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 pb-1.5 border-b border-border/40 text-[11px] font-semibold text-muted-foreground w-full justify-center">
            <span className="w-5 sm:w-6 shrink-0 text-center text-[10px] text-muted-foreground/60">
              แถว
            </span>

            {/* Left Column Letters */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {leftCols.map((col) => (
                <div
                  key={`col-header-${col}`}
                  className="size-7 sm:size-8 md:size-9 flex items-center justify-center font-mono font-bold text-xs sm:text-sm text-foreground/80"
                >
                  {col}
                </div>
              ))}
            </div>

            {/* Center Aisle Label */}
            <div className="w-4 sm:w-6 text-center text-[9px] text-muted-foreground/50 shrink-0">
              ทางเดิน
            </div>

            {/* Right Column Letters */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {rightCols.map((col) => (
                <div
                  key={`col-header-${col}`}
                  className="size-7 sm:size-8 md:size-9 flex items-center justify-center font-mono font-bold text-xs sm:text-sm text-foreground/80"
                >
                  {col}
                </div>
              ))}
            </div>

            <span className="w-5 sm:w-6 shrink-0 text-center text-[10px] text-muted-foreground/60">
              แถว
            </span>
          </div>

          {/* Rows from Front to Back (1 to maxRow) */}
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            {Array.from({ length: maxRow }, (_, i) => i + 1).map((r) => (
              <div key={`row-${r}`} className="flex items-center gap-1.5 sm:gap-2">
                {/* Left Row Number */}
                <span className="w-5 sm:w-6 font-mono font-bold text-xs text-muted-foreground text-center shrink-0">
                  {r}
                </span>

                {/* Left Columns (A, B, C...) */}
                <div className="flex items-center gap-1 sm:gap-1.5">
                  {leftCols.map((col) => {
                    const seatId = `${col}${r}`;
                    const student = session.seats[seatId];
                    const isMySeat =
                      seatId === mySeat ||
                      Boolean(myStudentId && student?.student_id === myStudentId);
                    const isSelected = seatId === selectedSeat;

                    if (!student) {
                      return (
                        <div
                          key={seatId}
                          title={`ที่นั่งเว้นระยะ / สอบวิชาอื่น (${seatId})`}
                          className="size-7 sm:size-8 md:size-9 rounded-full border border-dashed border-border/40 bg-muted/20 flex items-center justify-center text-[9px] font-mono text-muted-foreground/30"
                        >
                          {seatId}
                        </div>
                      );
                    }

                    return (
                      <button
                        key={seatId}
                        type="button"
                        onClick={() => setSelectedSeat(seatId)}
                        title={`ที่นั่ง ${seatId}: ${student.name} (${student.student_id})`}
                        className={`size-7 sm:size-8 md:size-9 rounded-full text-[10px] sm:text-xs font-mono transition-all flex items-center justify-center relative cursor-pointer ${
                          isMySeat
                            ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/30 ring-2 ring-primary ring-offset-2 scale-110 z-10"
                            : isSelected
                            ? "bg-foreground text-background font-bold ring-2 ring-foreground/20 scale-105 z-10"
                            : "bg-slate-200 dark:bg-slate-700/80 text-slate-800 dark:text-slate-100 font-semibold hover:bg-primary/20 hover:text-primary"
                        }`}
                      >
                        <span className="leading-none">{seatId}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Center Aisle Spacer */}
                <div className="w-4 sm:w-6 flex flex-col items-center justify-center shrink-0">
                  <div className="h-4 sm:h-5 w-[1px] bg-border/40" />
                </div>

                {/* Right Columns (D, E, F, G...) */}
                <div className="flex items-center gap-1 sm:gap-1.5">
                  {rightCols.map((col) => {
                    const seatId = `${col}${r}`;
                    const student = session.seats[seatId];
                    const isMySeat =
                      seatId === mySeat ||
                      Boolean(myStudentId && student?.student_id === myStudentId);
                    const isSelected = seatId === selectedSeat;

                    if (!student) {
                      return (
                        <div
                          key={seatId}
                          title={`ที่นั่งเว้นระยะ / สอบวิชาอื่น (${seatId})`}
                          className="size-7 sm:size-8 md:size-9 rounded-full border border-dashed border-border/40 bg-muted/20 flex items-center justify-center text-[9px] font-mono text-muted-foreground/30"
                        >
                          {seatId}
                        </div>
                      );
                    }

                    return (
                      <button
                        key={seatId}
                        type="button"
                        onClick={() => setSelectedSeat(seatId)}
                        title={`ที่นั่ง ${seatId}: ${student.name} (${student.student_id})`}
                        className={`size-7 sm:size-8 md:size-9 rounded-full text-[10px] sm:text-xs font-mono transition-all flex items-center justify-center relative cursor-pointer ${
                          isMySeat
                            ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/30 ring-2 ring-primary ring-offset-2 scale-110 z-10"
                            : isSelected
                            ? "bg-foreground text-background font-bold ring-2 ring-foreground/20 scale-105 z-10"
                            : "bg-slate-200 dark:bg-slate-700/80 text-slate-800 dark:text-slate-100 font-semibold hover:bg-primary/20 hover:text-primary"
                        }`}
                      >
                        <span className="leading-none">{seatId}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Right Row Number */}
                <span className="w-5 sm:w-6 font-mono font-bold text-xs text-muted-foreground text-center shrink-0">
                  {r}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. Circular Legend Bar ── */}
      <div className="mt-3.5 flex flex-wrap items-center justify-center gap-3 sm:gap-5 border-t pt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="size-3.5 sm:size-4 rounded-full bg-primary ring-1 ring-primary/40 shadow-xs" />
          <span className="font-medium text-foreground">ที่นั่งของคุณ ({mySeat || "-"})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-3.5 sm:size-4 rounded-full bg-slate-200 dark:bg-slate-700" />
          <span>มีผู้เข้าสอบ</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-3.5 sm:size-4 rounded-full border border-dashed border-border/40 bg-muted/20" />
          <span>ที่นั่งเว้นระยะ</span>
        </div>
      </div>

      {/* ── 5. Selected Seat Inspector Drawer ── */}
      {selectedSeat && selectedStudent && (
        <div className="mt-3.5 rounded-2xl border bg-muted/30 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in-0 duration-200">
          <div className="flex items-center gap-3">
            <div className="size-10 sm:size-11 shrink-0 rounded-full bg-primary text-primary-foreground font-mono font-bold text-sm sm:text-base flex items-center justify-center shadow-xs">
              {selectedSeat}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-sm sm:text-base text-foreground truncate">
                  {selectedStudent.name}
                </span>
                {selectedSeat === mySeat && (
                  <Badge className="rounded-full text-[10px] bg-primary/20 text-primary border-primary/30">
                    คุณ (You)
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span className="font-mono">รหัส {selectedStudent.student_id}</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground sm:text-right">
            <span>แตะที่นั่งอื่นเพื่อดูเพื่อนร่วมห้อง</span>
          </div>
        </div>
      )}
    </div>
  );
}
