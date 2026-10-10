import { NextRequest, NextResponse } from 'next/server';
import {
  getRoom,
  joinRoom,
  startRoomMatch,
  submitWordInRoom,
  endRoomMatchManually
} from '@/lib/rooms/roomStore';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const room = getRoom(roomId);

    if (!room) {
      return NextResponse.json(
        { success: false, error: 'اتاق یافت نشد یا منقضی شده است.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, room });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'خطای سرور';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const body = await req.json();
    const action = body.action;

    if (action === 'join') {
      const res = joinRoom(roomId, body.playerName || '', body.avatar);
      return NextResponse.json(res);
    }

    if (action === 'start') {
      const res = startRoomMatch(roomId, body.playerId || '');
      return NextResponse.json(res);
    }

    if (action === 'submitWord') {
      const res = submitWordInRoom(roomId, body.playerId || '', body.word || '');
      return NextResponse.json(res);
    }

    if (action === 'endGame') {
      // Manual end game trigger!
      const res = endRoomMatchManually(roomId, body.playerId);
      return NextResponse.json(res);
    }

    return NextResponse.json(
      { success: false, error: 'عملیات نامعتبر است.' },
      { status: 400 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'خطای سرور';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
