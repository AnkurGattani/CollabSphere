import { Liveblocks } from '@liveblocks/node';

const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY!,
})

export async function POST(req: Request) {
        const { user, room } = await req.json();

    // generate color based on user's name
    const name = user.firstName + " " + user.lastName;
    const nameToNumber = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const color = `hsl(${nameToNumber % 360}, 80%, 60%)`;


    const session = liveblocks.prepareSession(user.email, {
        userInfo: {
            name,
            color,
        }
    });

    session.allow(room, session.FULL_ACCESS);
    const { body, status } = await session.authorize();

    return new Response(body, { status });
}