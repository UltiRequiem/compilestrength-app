# Blog Creation Guide for CompileStrength

This guide provides instructions for creating new blog posts in the
CompileStrength application. Follow these guidelines to maintain consistency and
avoid code duplication.

## Important: Use Existing Components

**DO NOT create navbar components within blog posts.** We already have reusable
navbar components:

- `@/components/navbar` - Standard navbar with authentication state management
  (client-side)
- `@/components/landing-navbar` - Landing page navbar with logo and manual auth
  props

## Directory Structure

Blog posts follow this structure:

```
src/app/blog/
├── page.tsx              # Blog index/listing page
├── layout.tsx            # Blog section layout and metadata
└── [blog-post-slug]/
    ├── page.tsx          # Blog post content
    └── layout.tsx        # Post-specific metadata
```

## Creating a New Blog Post

### 1. Create the Directory Structure

```bash
mkdir -p src/app/blog/your-blog-post-slug
```

### 2. Create the Layout File

Create `src/app/blog/your-blog-post-slug/layout.tsx`:

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Blog Post Title",
  description: "Brief description of your blog post content.",
  keywords: [
    "relevant",
    "keywords",
    "for",
    "seo",
  ],
  openGraph: {
    title: "Your Blog Post Title",
    description: "Brief description of your blog post content.",
    url: "https://compilestrength.com/blog/your-blog-post-slug",
    images: ["/logo.png"],
    type: "article",
    publishedTime: "YYYY-MM-DD", // Use ISO date format
    authors: ["CompileStrength"],
  },
  twitter: {
    title: "Your Blog Post Title",
    description: "Brief description for Twitter card.",
    images: ["/logo.png"],
    card: "summary_large_image",
  },
};

export default function YourBlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

### 3. Create the Page Content

Create `src/app/blog/your-blog-post-slug/page.tsx`:

```typescript
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar"; // ALWAYS use this component
import { auth } from "@/lib/auth";

export default async function YourBlogPost() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Back Link */}
        <Link
          href="/blog"
          className="text-sm text-zinc-400 hover:text-blue-500 mb-6 inline-block"
        >
          ← Back to Blog
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <div className="mb-4">
            <div className="flex items-center gap-4 text-sm text-zinc-400 mb-4">
              <span>Month DD, YYYY</span>
              <span>•</span>
              <span>X min read</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Your Blog Post Title
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed">
              Brief description/subtitle of your blog post that provides
              context.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Tag 1", "Tag 2", "Tag 3"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full border border-blue-500/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-invert prose-zinc max-w-none">
          <div className="space-y-6 text-zinc-300 leading-relaxed">
            {/* Your blog content goes here */}
            <p className="text-lg">
              Your opening paragraph...
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Section Heading
            </h2>

            <p>
              Your content...
            </p>

            {/* Continue with your content structure */}
          </div>
        </div>

        {/* CTA Section - Only show to non-authenticated users */}
        {!session && (
          <div className="mt-16 border border-zinc-800 p-8 rounded-xl bg-zinc-900/50 text-center">
            <h3 className="text-2xl font-bold mb-3">
              Ready to Apply What You've Learned?
            </h3>
            <p className="text-zinc-400 mb-6">
              Create science-based training programs with CompileStrength
            </p>
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8">
                Try CompileStrength Free
              </Button>
            </Link>
          </div>
        )}
      </article>
    </div>
  );
}
```

## Content Guidelines

### Typography Hierarchy

Use consistent heading styles:

```typescript
// Main title (already in header)
<h1 className="text-4xl font-bold mb-4 leading-tight">

// Section headings
<h2 className="text-2xl font-bold text-white mt-8 mb-4">

// Subsection headings
<h3 className="text-xl font-semibold text-white mt-6 mb-3">

// Body text
<p className="text-zinc-300 leading-relaxed">

// Emphasized text
<p className="text-lg"> // For opening paragraphs
```

### Lists

```typescript
// Ordered lists
<ol className="list-decimal list-inside space-y-2 ml-4">
	<li><strong>Item title</strong>: Description</li>
</ol>

// Unordered lists
<ul className="list-disc list-inside space-y-2 ml-4">
	<li><strong>Item title</strong>: Description</li>
</ul>
```

### Code Examples (if needed)

```typescript
<pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
	<code className="text-sm text-zinc-300">
		// Your code here
	</code>
</pre>;
```

## SEO Best Practices

### Keywords

- Include relevant fitness/training keywords
- Use long-tail keywords specific to the content
- Research trending fitness topics

### Meta Description

- Keep between 150-160 characters
- Include primary keyword
- Make it compelling and actionable

### URL Structure

- Use kebab-case (hyphens, not underscores)
- Keep URLs concise but descriptive
- Include primary keyword if possible

## Content Standards

### Writing Style

- **Tone**: Professional, evidence-based, approachable
- **Audience**: Science-minded fitness enthusiasts and athletes
- **Length**: Aim for 1,500-3,000 words for comprehensive coverage
- **Structure**: Use clear headings, bullet points, and short paragraphs

### Research & Citations

- Reference peer-reviewed studies when making scientific claims
- Include publication year and authors for credibility
- Link to reputable sources when possible

### Fitness Focus Areas

- Progressive overload and periodization
- Evidence-based training methods
- Nutrition science
- Recovery and adaptation
- Training program design
- Exercise selection and technique

## Technical Requirements

### Authentication Integration

- Always import and use `auth` for session management
- Show CTA section only to non-authenticated users
- Use conditional rendering based on session state

### Component Imports

```typescript
// Required imports for every blog post
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar"; // CRITICAL: Always use this
import { auth } from "@/lib/auth";
```

### Styling

- Use existing Tailwind classes
- Follow dark mode design system (zinc-950 background, zinc-100 text)
- Maintain consistent spacing and typography
- Ensure mobile responsiveness

## Common Mistakes to Avoid

1. **Creating custom navbar code** - Always use `@/components/navbar`
2. **Missing back link** - Always include "← Back to Blog" link
3. **Inconsistent metadata** - Follow the layout template exactly
4. **Missing CTA section** - Include conversion element for non-authenticated
   users
5. **Poor mobile experience** - Test on mobile devices
6. **Missing keywords** - Include relevant SEO keywords in metadata
7. **Inconsistent styling** - Follow the established design patterns

## Testing Checklist

Before publishing a blog post:

- [ ] Navbar renders correctly using shared component
- [ ] Back link works and navigates to `/blog`
- [ ] CTA section shows only for non-authenticated users
- [ ] All links work correctly
- [ ] Content is mobile-responsive
- [ ] Metadata is complete and accurate
- [ ] Tags are relevant and properly styled
- [ ] Typography hierarchy is consistent
- [ ] Page loads without console errors

## Example Blog Post Structure

Reference the existing blog post at
`src/app/blog/progressive-overload-science/page.tsx` as a template for:

- Content structure and organization
- Proper use of headings and typography
- Scientific content approach
- CTA integration
- Overall page layout

Remember: The goal is consistency, maintainability, and a great user experience
across all blog content.
