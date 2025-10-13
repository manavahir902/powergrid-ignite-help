import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface KBArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  keywords: string[];
  view_count: number;
  helpful_count: number;
}

const KnowledgeBase = () => {
  const [articles, setArticles] = useState<KBArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<KBArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = ["network", "account", "email", "hardware", "software", "printer", "other"];

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [searchQuery, selectedCategory, articles]);

  const loadArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("knowledge_base")
        .select("*")
        .order("view_count", { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("Error loading KB articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    if (selectedCategory) {
      filtered = filtered.filter((article) => article.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          article.keywords?.some((keyword) => keyword.toLowerCase().includes(query))
      );
    }

    setFilteredArticles(filtered);
  };

  const incrementViewCount = async (articleId: string) => {
    await supabase
      .from("knowledge_base")
      .update({ view_count: supabase.raw("view_count + 1") })
      .eq("id", articleId);
  };

  if (loading) {
    return <div className="text-center py-8">Loading knowledge base...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Knowledge Base
          </CardTitle>
          <CardDescription>
            Search our collection of solutions and troubleshooting guides
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search articles, solutions, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer capitalize"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {filteredArticles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No articles found. Try adjusting your search or filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {filteredArticles.map((article) => (
            <AccordionItem value={article.id} key={article.id} className="border rounded-lg px-6">
              <AccordionTrigger
                onClick={() => incrementViewCount(article.id)}
                className="hover:no-underline"
              >
                <div className="flex items-start justify-between w-full pr-4">
                  <span className="text-left font-semibold">{article.title}</span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="capitalize">
                      {article.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {article.view_count} views
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm whitespace-pre-wrap">
                {article.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default KnowledgeBase;