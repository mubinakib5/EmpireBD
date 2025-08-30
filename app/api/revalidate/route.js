import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { _type, slug } = body;

    // Verify the request is from Sanity (optional but recommended)
    const token = request.headers.get("authorization");
    if (token !== `Bearer ${process.env.SANITY_REVALIDATE_SECRET}`) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Revalidate based on document type
    if (_type === "product") {
      // Revalidate all explore pages since products can belong to different segments
      revalidateTag("products");

      // If we have the product slug, revalidate the specific product page
      if (slug?.current) {
        revalidatePath(`/product/${slug.current}`);
      }

      // Revalidate all explore pages (we could be more specific if we had the segment)
      revalidatePath("/explore/[segment]", "page");

      console.log("Revalidated product pages");
    } else if (_type === "heroSegment") {
      // Revalidate the homepage with heroSegments tag
      revalidateTag("heroSegments");
      revalidatePath("/");

      // Revalidate the specific explore page for this segment
      if (slug?.current) {
        revalidatePath(`/explore/${slug.current}`);
      }

      // Revalidate all explore pages
      revalidatePath("/explore/[segment]", "page");

      console.log("Revalidated hero segment pages and homepage");
    }

    return NextResponse.json({
      message: "Revalidation successful",
      revalidated: true,
      now: Date.now(),
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { message: "Error revalidating", error: error.message },
      { status: 500 }
    );
  }
}

// Handle GET requests for testing
export async function GET() {
  return NextResponse.json({
    message: "Revalidation endpoint is working",
    timestamp: new Date().toISOString(),
  });
}
