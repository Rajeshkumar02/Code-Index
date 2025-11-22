import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, increment, arrayUnion, arrayRemove } from "firebase/firestore";
import { NextResponse } from "next/server";

export type ReactionType = "like" | "love" | "dislike" | "clap" | "fire" | "insightful";

interface ReactionData {
  like: number;
  love: number;
  dislike: number;
  clap: number;
  fire: number;
  insightful: number;
  // Track which users reacted with what
  likeUsers?: string[];
  loveUsers?: string[];
  dislikeUsers?: string[];
  clapUsers?: string[];
  fireUsers?: string[];
  insightfulUsers?: string[];
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = (await params).slug;
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    const docRef = doc(db, "reactions", slug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as ReactionData;
      
      // Determine user's current reaction
      let userReaction: ReactionType | null = null;
      if (userId) {
        const reactionTypes: ReactionType[] = ["like", "love", "dislike", "clap", "fire", "insightful"];
        for (const type of reactionTypes) {
          const usersKey = `${type}Users` as keyof ReactionData;
          if (data[usersKey] && Array.isArray(data[usersKey]) && data[usersKey]!.includes(userId)) {
            userReaction = type;
            break;
          }
        }
      }

      return NextResponse.json({
        reactions: {
          like: data.like || 0,
          love: data.love || 0,
          dislike: data.dislike || 0,
          clap: data.clap || 0,
          fire: data.fire || 0,
          insightful: data.insightful || 0,
        },
        userReaction,
      });
    } else {
      return NextResponse.json({
        reactions: { like: 0, love: 0, dislike: 0, clap: 0, fire: 0, insightful: 0 },
        userReaction: null,
      });
    }
  } catch (error) {
    console.error("Error fetching reactions:", error);
    return NextResponse.json(
      { 
        reactions: { like: 0, love: 0, dislike: 0, clap: 0, fire: 0, insightful: 0 },
        userReaction: null,
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = (await params).slug;
    const body = await request.json();
    const { reaction, previousReaction, userId } = body as {
      reaction: ReactionType;
      previousReaction?: ReactionType;
      userId: string;
    };

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const docRef = doc(db, "reactions", slug);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // Create new document with the reaction
      await setDoc(docRef, {
        like: reaction === "like" ? 1 : 0,
        love: reaction === "love" ? 1 : 0,
        dislike: reaction === "dislike" ? 1 : 0,
        clap: reaction === "clap" ? 1 : 0,
        fire: reaction === "fire" ? 1 : 0,
        insightful: reaction === "insightful" ? 1 : 0,
        [`${reaction}Users`]: [userId],
      });
    } else {
      // Update existing document
      const updates: Record<string, any> = {};

      // Remove user from previous reaction if exists
      if (previousReaction) {
        updates[previousReaction] = increment(-1);
        updates[`${previousReaction}Users`] = arrayRemove(userId);
      }

      // Add user to new reaction
      updates[reaction] = increment(1);
      updates[`${reaction}Users`] = arrayUnion(userId);

      await updateDoc(docRef, updates);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating reactions:", error);
    return NextResponse.json(
      { error: "Error updating reactions" },
      { status: 500 }
    );
  }
}
