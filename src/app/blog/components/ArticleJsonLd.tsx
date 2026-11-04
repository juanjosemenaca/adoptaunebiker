export function ArticleJsonLd({ data }: { data: Record<string, unknown> | null }) {
  if (!data) {
    return null;
  }
  // Escape `<` so a value containing `</script>` cannot break out of the tag.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
