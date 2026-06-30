import React, { useState, useEffect } from 'react';
import { FileText, Calendar } from 'lucide-react';
import { api, optimizeCloudinaryUrl } from '../services/api';
import ImageWithLoader from './ImageWithLoader';

export default function BlogSection() {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await api.getData('blog_posts', []);
        if (stored && stored.length > 0) {
          setBlogPosts(stored);
        }
      } catch(e) {
        console.warn("Storage blocked");
      }
    };
    loadData();
  }, []);

  if (blogPosts.length === 0) return null;

  return (
    <section id="blog" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-tiger-orange/10 px-3.5 py-1.5 rounded-full mb-4">
            <FileText className="w-4 h-4 text-tiger-orange" />
            <span className="text-xs font-mono font-bold tracking-widest text-tiger-orange uppercase">Latest Updates</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-tiger-dark tracking-tight leading-tight">
            Our Blog & News
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map(post => (
            <div key={post.id} className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
              {post.image && (
                <div className="h-48 overflow-hidden">
                  <ImageWithLoader 
                    src={optimizeCloudinaryUrl(post.image)} 
                    alt={post.title} 
                    loading="lazy" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                    containerClassName="w-full h-full"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3 font-mono">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.date || Date.now()).toLocaleDateString()}</span>
                </div>
                <h3 className="font-display font-bold text-xl text-tiger-dark mb-3">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
