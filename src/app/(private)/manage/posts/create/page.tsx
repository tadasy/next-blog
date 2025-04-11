'use client'
import { useState, useActionState } from "react";
// import createPost from "@/lib/actions/createPost";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import TextareaAutosize from "react-textarea-autosize";
import "highlight.js/styles/github.css";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createPost } from "@/lib/actions/createPost";

export default function CreatePage() {
  const [content, setContent] = useState(""); // 記事の文章
  const [contentLength, setContentLength] = useState(0); // 文字数
  const [preview, setPreview] = useState(false); // プレビュー
  const [state, formAction, isPending] = useActionState(createPost, { success: false, errors: {} });

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    setContentLength(value.length)
  };
  // const [state, formAction ] = useActionState(createPost, { success: false, errors: {} })

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">新規記事作成(Markdown対応)</h1>
      <form className="space-y-4" action={formAction}>
        <div>
          <Label htmlFor="title">タイトル</Label>
          <Input type="text" id="title" name="title" placeholder="記事のタイトル" />
          {state.errors.title && state.errors.title.map((error, index) => (
            <p key={index} className="text-sm text-red-500 mt-1">{error}</p>
          ))}
        </div>
        <div>
          <Label htmlFor="topImage">トップ画像</Label>
          <Input
            type="file"
            id="topImage"
            accept="image/*"
            name="topImage"
          />
          {state.errors.topImage && state.errors.topImage.map((error, index) => (
            <p key={index} className="text-sm text-red-500 mt-1">{error}</p>
          ))}
        </div>
        <div>
          <Label htmlFor="content">内容(Markdown)</Label>
          <TextareaAutosize
            id="content"
            name="content"
            placeholder="記事の内容"
            value={content}
            onChange={handleContentChange}
            minRows={8}
            maxRows={20}
            className="w-full p-2 border"
          />
          {state.errors.content && state.errors.content.map((error, index) => (
            <p key={index} className="text-sm text-red-500 mt-1">{error}</p>
          ))}
        </div>
        <div className="text-right text-sm text-gray-500 mt-1">
          文字数: {contentLength}
        </div>
        <div>
          <Button type="button" onClick={() => setPreview(!preview)}>
            {preview ? "プレビューを閉じる" : "プレビューを表示"}
          </Button>
        </div>
        {preview && (
          <div className="p-4 border bg-gray-50 prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              skipHtml={false}
              unwrapDisallowed={true}
            >{content}</ReactMarkdown>
          </div>
        )}
        <Button type="submit" disabled={isPending} className="bg-blue-500 text-white px-4 py-2 rounded">
          {isPending ? "作成中..." : "記事を作成"}
        </Button>
      </form>
    </div>
  )
}
