import { JSDOM } from "jsdom";
import { NextResponse } from "next/server";
import { Readability, isProbablyReaderable } from "@mozilla/readability";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hasUrl = searchParams.has("url");

    const url = hasUrl ? searchParams.get("url") : null;

    if (!url) {
      return;
    }

    const response = await fetch(url);

    const responseText = await response.text();

    const parsedContent = await parseContent(url, responseText);

    return NextResponse.json({ result: parsedContent });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "" });
  }
}

async function parseContent(
  url: string,
  pageContent: string,
): Promise<Record<string, string | number> | null> {
  const dom = new JSDOM(pageContent, { url: url });

  if (!isProbablyReaderable(dom.window.document)) {
    return null;
  }

  const parsedContent = new Readability(dom.window.document).parse();

  return parsedContent;
}
