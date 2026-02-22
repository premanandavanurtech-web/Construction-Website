import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const images = formData.getAll("images") as File[];

  if (!images.length) {
    return NextResponse.json(
      { message: "No images received" },
      { status: 400 }
    );
  }

  // Just logging for now
  const imageInfo = images.map((img) => ({
    name: img.name,
    size: img.size,
    type: img.type,
  }));

  console.log("Received images:", imageInfo);

  return NextResponse.json({
    message: "Images uploaded successfully",
    files: imageInfo,
  });
}