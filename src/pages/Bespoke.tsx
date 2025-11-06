import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EkaHeader } from "@/components/EkaHeader";
import { EkaFooter } from "@/components/EkaFooter";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function Bespoke() {
  const [content, setContent] = useState({
    title: "",
    intro: "",
    process: "",
    timeline: "",
    pricing: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["bespoke_title", "bespoke_intro", "bespoke_process", "bespoke_timeline", "bespoke_pricing"]);

      if (error) throw error;

      const contentMap = data.reduce((acc, item) => {
        const key = item.key.replace("bespoke_", "");
        acc[key] = item.value;
        return acc;
      }, {} as any);

      setContent(contentMap);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-eka-pearl text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <EkaHeader />

      <div className="container mx-auto px-4 py-20 pt-24 sm:pt-28 relative z-10 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-heading text-eka-pearl mb-6">
            {content.title}
          </h1>
          <p className="text-xl text-eka-champagne max-w-3xl mx-auto leading-relaxed">
            {content.intro}
          </p>
        </div>

        <div className="bg-gradient-glass backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-eka-jade-luxury/30 mb-12">
          <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 className="text-3xl font-heading text-eka-pearl mb-6 mt-8 first:mt-0">
                    {children}
                  </h2>
                ),
                p: ({ children }) => (
                  <p className="text-eka-champagne mb-4 leading-relaxed">
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="text-eka-golden font-semibold">
                    {children}
                  </strong>
                ),
              }}
            >
              {content.process}
            </ReactMarkdown>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gradient-glass backdrop-blur-xl rounded-2xl p-6 border border-eka-jade-luxury/30">
            <h3 className="text-2xl font-heading text-eka-pearl mb-4">Timeline</h3>
            <p className="text-eka-champagne leading-relaxed">{content.timeline}</p>
          </div>
          <div className="bg-gradient-glass backdrop-blur-xl rounded-2xl p-6 border border-eka-jade-luxury/30">
            <h3 className="text-2xl font-heading text-eka-pearl mb-4">Investment</h3>
            <p className="text-eka-champagne leading-relaxed">{content.pricing}</p>
          </div>
        </div>

        <div className="text-center">
          <Link to="/register">
            <Button className="bg-eka-golden hover:bg-eka-golden/80 text-eka-emerald-depth px-12 py-6 text-lg rounded-full">
              Schedule a Consultation
            </Button>
          </Link>
          <p className="text-eka-champagne mt-4">
            Become a client to access our bespoke services
          </p>
        </div>
      </div>

      <EkaFooter />
    </div>
  );
}