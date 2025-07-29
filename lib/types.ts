// lib/types.ts

// 定义愿望清单项目的数据结构
// 这与我们在 Supabase 中创建的 wishlists 表结构相对应
export type Wish = {
  id: string; // UUID
  user_id: string; // UUID, 外键
  item_name: string;
  description: string | null;
  priority: 'High' | 'Medium' | 'Low';
  due_date: string | null; // Date, 格式为 'YYYY-MM-DD'
  is_public: boolean;
  is_completed: boolean;
  created_at: string; // aith Timezone
  updated_at: string; // aith Timezone
};
 