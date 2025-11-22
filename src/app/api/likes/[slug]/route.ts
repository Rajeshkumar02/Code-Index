import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, increment } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = (await params).slug;
    const docRef = doc(db, "likes", slug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return NextResponse.json({ likes: docSnap.data().count || 0 });
    } else {
      return NextResponse.json({ likes: 0 });
    }
  } catch (error) {
    console.error("Error fetching likes:", error);
    return NextResponse.json({ likes: 0 }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = (await params).slug;
    const docRef = doc(db, "likes", slug);

    await setDoc(docRef, { count: increment(1) }, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error incrementing likes:", error);
    return NextResponse.json({ error: "Error incrementing likes" }, { status: 500 });
  }
}
