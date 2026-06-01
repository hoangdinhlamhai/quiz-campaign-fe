export type LookupTool = {
  slug: string
  name: string
  description: string
  category: string
  formType: 'LOVE' | 'AFFINITY' | 'BABY_NAMING'
}

export const LOOKUP_TOOLS: LookupTool[] = [
  {
    slug: 'boi-tinh-yeu',
    name: 'Bói Tình Yêu',
    description: 'Phân tích sức hút, chemistry và ngôn ngữ tình yêu giữa hai người — tập trung vào cảm xúc, đam mê và sự rung động ban đầu.',
    category: 'than-so-hoc',
    formType: 'LOVE',
  },
  {
    slug: 'boi-tinh-duyen',
    name: 'Bói Tình Duyên',
    description: 'Đánh giá mức độ tương hợp dài hạn, khả năng đồng hành suốt đời — tập trung vào sứ mệnh chung, sự trưởng thành và duyên phận.',
    category: 'than-so-hoc',
    formType: 'AFFINITY',
  },
  {
    slug: 'dat-ten-con',
    name: 'Đặt Tên Con',
    description: 'Phân tích điểm phong thủy thần số học cho tên của bé.',
    category: 'than-so-hoc',
    formType: 'BABY_NAMING',
  },
]

export function findLookupTool(slug: string): LookupTool | undefined {
  return LOOKUP_TOOLS.find((t) => t.slug === slug)
}

export function getLookupToolsByCategory(categorySlug: string): LookupTool[] {
  return LOOKUP_TOOLS.filter((t) => t.category === categorySlug)
}
