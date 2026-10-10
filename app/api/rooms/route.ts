import { NextRequest, NextResponse } from 'next/server';
import { createRoom } from '@/lib/rooms/roomStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const hostName = body.hostName || 'میزبان';
    const maxPlayers = parseInt(body.maxPlayers, 10) || 4;
    const settings = body.settings || {};

    const room = createRoom(hostName, maxPlayers, settings);
    const hostPlayer = room.players[0];

    return NextResponse.json({
      success: true,
      room,
      roomId: room.id,
      playerId: hostPlayer.id
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'خطا در ایجاد اتاق';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
