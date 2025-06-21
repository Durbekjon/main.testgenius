import Script from 'next/script'

interface StructuredDataProps {
  type: 'website' | 'organization' | 'software' | 'product'
  data: any
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "TestGenius AI",
          "url": "https://testgenius.uz",
          "description": "AI-powered test generation platform for educators and businesses",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://testgenius.uz/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }
      
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "TestGenius AI",
          "url": "https://testgenius.uz",
          "logo": "https://testgenius.uz/logo.png",
          "description": "AI-powered test generation platform",
          "sameAs": [
            "https://twitter.com/testgeniusai",
            "https://linkedin.com/company/testgeniusai",
            "https://facebook.com/testgeniusai"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "support@testgenius.uz"
          }
        }
      
      case 'software':
        return {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "TestGenius AI",
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Web Browser",
          "url": "https://testgenius.uz",
          "description": "AI-powered test generation platform for creating professional assessments",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          },
          "featureList": [
            "AI-powered test generation",
            "Multiple question types",
            "Real-time analytics",
            "Test monitoring",
            "Customizable templates",
            "Export capabilities"
          ],
          "screenshot": "https://testgenius.uz/screenshot.png",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "1250"
          }
        }
      
      case 'product':
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "TestGenius AI Platform",
          "description": "Professional AI-powered test generation platform",
          "brand": {
            "@type": "Brand",
            "name": "TestGenius AI"
          },
          "offers": [
            {
              "@type": "Offer",
              "name": "Free Plan",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            {
              "@type": "Offer",
              "name": "Pro Plan",
              "price": "29",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            {
              "@type": "Offer",
              "name": "Enterprise Plan",
              "price": "99",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            }
          ]
        }
      
      default:
        return data
    }
  }

  const structuredData = getStructuredData()

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}

// FAQ Schema for better search results
export function FAQStructuredData({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <Script
      id="faq-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqData),
      }}
    />
  )
}

// Breadcrumb Schema
export function BreadcrumbStructuredData({ items }: { items: Array<{ name: string; url: string }> }) {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }

  return (
    <Script
      id="breadcrumb-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbData),
      }}
    />
  )
} 