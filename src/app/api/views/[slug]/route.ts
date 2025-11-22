import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { NextResponse } from "next/server";

interface ViewData {
  count: number;
  users: string[]; // Track unique users who viewed
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = (await params).slug;
    const docRef = doc(db, "views", slug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as ViewData;
      return NextResponse.json({ views: data.count || 0 });
    } else {
      return NextResponse.json({ views: 0 });
    }
  } catch (error) {
    console.error("Error fetching views:", error);
    return NextResponse.json({ views: 0 }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = (await params).slug;
    const body = await request.json();
    const { userId } = body as { userId: string };

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const docRef = doc(db, "views", slug);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // Create new document
      await setDoc(docRef, {
        count: 1,
        users: [userId],
      });
      return NextResponse.json({ success: true, counted: true });
    } else {
      const data = docSnap.data() as ViewData;
      
      // Check if user already viewed
      if (data.users && data.users.includes(userId)) {
        return NextResponse.json({ success: true, counted: false });
      }

      // Increment count and add user
      await updateDoc(docRef, {
        count: increment(1),
        users: arrayUnion(userId),
      });

      return NextResponse.json({ success: true, counted: true });
    }
  } catch (error) {
    console.error("Error incrementing views:", error);
    return NextResponse.json({ error: "Error incrementing views" }, { status: 500 });
  }
}
