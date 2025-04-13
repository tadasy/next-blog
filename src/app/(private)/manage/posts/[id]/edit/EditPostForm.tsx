'use client'
import { useState, useActionState, useEffect } from "react";
// import createPost from "@/lib/actions/createPost";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import TextareaAutosize from "react-textarea-autosize";
import "highlight.js/styles/github.css";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { updatePost } from "@/lib/actions/updatePost";


type EditPostFormProps = {
  post: {
    id: string;
    title: string;
    content: string;
    topImage?: string | null;
    published: boolean;
  }
};

export default function EditPostForm({ post }: EditPostFormProps) {
  const [contentLength, setContentLength] = useState(0); // 文字数
  const [preview, setPreview] = useState(false); // プレビュー

  const [title, setTitle] = useState(post.title); // 記事のタイトル
  const [content, setContent] = useState(post.content); // 記事の内容
  const [published, setPublished] = useState(post.published); // 公開状態

  const [imagePreview, setImagePreview] = useState(post.topImage); // トップ画像のプレビュー

  const [state, formAction, isPending] = useActionState(updatePost, { success: false, errors: {} });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview !== post.topImage) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, post.topImage]);

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
        <input type="hidden" name="postId" value={post.id} />
        <input type="hidden" name="oldImageUrl" value={post.topImage || ''} />

        <div>
          <Label htmlFor="title">タイトル</Label>
          <Input type="text" id="title" name="title" placeholder="記事のタイトル"
            value={title} onChange={(e) => setTitle(e.target.value)} />
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
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="mt-2">
              <Image
                src={imagePreview}
                alt={post.title}
                width={0}
                height={0}
                sizes="200px"
                className="w-[200px]"
                priority
              />
            </div>
          )}
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

        <RadioGroup value={published.toString()} name="published" onValueChange={(value) => setPublished(value === 'true')}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="published-one" />
            <Label htmlFor="published-one">表示</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="published-two" />
            <Label htmlFor="published-two">非表示</Label>
          </div>
        </RadioGroup>

        <Button type="submit" disabled={isPending} className="bg-blue-500 text-white px-4 py-2 rounded">
          {isPending ? "更新中..." : "記事を更新"}
        </Button>
      </form>
    </div>
  )
}
