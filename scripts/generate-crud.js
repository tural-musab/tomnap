#!/usr/bin/env node

/**
 * CRUD Generator for Supabase Tables
 * Automatically generates TypeScript CRUD operations, hooks, and components
 * 
 * Usage: node scripts/generate-crud.js [table-name]
 * Example: node scripts/generate-crud.js products
 */

const fs = require('fs');
const path = require('path');

// Template for CRUD operations
const generateCRUDTemplate = (tableName, singularName) => {
  const capitalizedSingular = singularName.charAt(0).toUpperCase() + singularName.slice(1);
  const capitalizedPlural = tableName.charAt(0).toUpperCase() + tableName.slice(1);

  return {
    // Types
    types: `// Generated types for ${tableName}
export interface ${capitalizedSingular} {
  id: string;
  created_at: string;
  updated_at: string;
  // Add your fields here
  name?: string;
  description?: string;
  price?: number;
  image_url?: string;
  user_id?: string;
}

export interface Create${capitalizedSingular}DTO {
  name: string;
  description?: string;
  price?: number;
  image_url?: string;
}

export interface Update${capitalizedSingular}DTO extends Partial<Create${capitalizedSingular}DTO> {}
`,

    // API Functions
    api: `import { createClient } from '@/lib/supabase/client';
import type { ${capitalizedSingular}, Create${capitalizedSingular}DTO, Update${capitalizedSingular}DTO } from '@/types/${tableName}';

const supabase = createClient();

// Get all ${tableName}
export async function get${capitalizedPlural}(
  limit = 10,
  offset = 0,
  orderBy = 'created_at',
  orderDirection: 'asc' | 'desc' = 'desc'
) {
  const { data, error, count } = await supabase
    .from('${tableName}')
    .select('*', { count: 'exact' })
    .order(orderBy, { ascending: orderDirection === 'asc' })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { data, count };
}

// Get single ${singularName}
export async function get${capitalizedSingular}(id: string) {
  const { data, error } = await supabase
    .from('${tableName}')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Create ${singularName}
export async function create${capitalizedSingular}(data: Create${capitalizedSingular}DTO) {
  const { data: created, error } = await supabase
    .from('${tableName}')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return created;
}

// Update ${singularName}
export async function update${capitalizedSingular}(id: string, data: Update${capitalizedSingular}DTO) {
  const { data: updated, error } = await supabase
    .from('${tableName}')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return updated;
}

// Delete ${singularName}
export async function delete${capitalizedSingular}(id: string) {
  const { error } = await supabase
    .from('${tableName}')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// Search ${tableName}
export async function search${capitalizedPlural}(query: string) {
  const { data, error } = await supabase
    .from('${tableName}')
    .select('*')
    .or(\`name.ilike.%\${query}%,description.ilike.%\${query}%\`)
    .limit(20);

  if (error) throw error;
  return data;
}
`,

    // React Hooks
    hooks: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  get${capitalizedPlural},
  get${capitalizedSingular},
  create${capitalizedSingular},
  update${capitalizedSingular},
  delete${capitalizedSingular},
  search${capitalizedPlural}
} from '@/lib/api/${tableName}';
import type { Create${capitalizedSingular}DTO, Update${capitalizedSingular}DTO } from '@/types/${tableName}';

// Hook to fetch all ${tableName}
export function use${capitalizedPlural}(
  limit = 10,
  offset = 0,
  orderBy = 'created_at',
  orderDirection: 'asc' | 'desc' = 'desc'
) {
  return useQuery({
    queryKey: ['${tableName}', limit, offset, orderBy, orderDirection],
    queryFn: () => get${capitalizedPlural}(limit, offset, orderBy, orderDirection),
  });
}

// Hook to fetch single ${singularName}
export function use${capitalizedSingular}(id: string | null) {
  return useQuery({
    queryKey: ['${tableName}', id],
    queryFn: () => get${capitalizedSingular}(id!),
    enabled: !!id,
  });
}

// Hook to create ${singularName}
export function useCreate${capitalizedSingular}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Create${capitalizedSingular}DTO) => create${capitalizedSingular}(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${tableName}'] });
      toast.success('${capitalizedSingular} created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create ${singularName}');
      console.error(error);
    },
  });
}

// Hook to update ${singularName}
export function useUpdate${capitalizedSingular}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Update${capitalizedSingular}DTO }) =>
      update${capitalizedSingular}(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['${tableName}'] });
      queryClient.invalidateQueries({ queryKey: ['${tableName}', variables.id] });
      toast.success('${capitalizedSingular} updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update ${singularName}');
      console.error(error);
    },
  });
}

// Hook to delete ${singularName}
export function useDelete${capitalizedSingular}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => delete${capitalizedSingular}(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${tableName}'] });
      toast.success('${capitalizedSingular} deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete ${singularName}');
      console.error(error);
    },
  });
}

// Hook to search ${tableName}
export function useSearch${capitalizedPlural}(query: string, enabled = true) {
  return useQuery({
    queryKey: ['${tableName}', 'search', query],
    queryFn: () => search${capitalizedPlural}(query),
    enabled: enabled && query.length > 0,
  });
}
`,

    // React Component
    component: `'use client'

import { useState } from 'react';
import { use${capitalizedPlural}, useCreate${capitalizedSingular}, useUpdate${capitalizedSingular}, useDelete${capitalizedSingular} } from '@/hooks/use-${tableName}';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';

export default function ${capitalizedPlural}Manager() {
  const [page, setPage] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const { data, isLoading, error } = use${capitalizedPlural}(10, page * 10);
  const createMutation = useCreate${capitalizedSingular}();
  const updateMutation = useUpdate${capitalizedSingular}();
  const deleteMutation = useDelete${capitalizedSingular}();

  const handleCreate = async (formData: FormData) => {
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
    };
    
    await createMutation.mutateAsync(data);
    setIsCreateOpen(false);
  };

  const handleUpdate = async (id: string, formData: FormData) => {
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
    };
    
    await updateMutation.mutateAsync({ id, data });
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading ${tableName}: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">${capitalizedPlural}</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add ${capitalizedSingular}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New ${capitalizedSingular}</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreate(new FormData(e.currentTarget));
              }}
              className="space-y-4"
            >
              <Input name="name" placeholder="Name" required />
              <Input name="description" placeholder="Description" />
              <Input name="price" type="number" step="0.01" placeholder="Price" />
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  'Create'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(item.id)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {data?.count && data.count > 10 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            Previous
          </Button>
          <span className="py-2 px-4">
            Page {page + 1} of {Math.ceil(data.count / 10)}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={(page + 1) * 10 >= data.count}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
`
  };
};

// Main function
function generateCRUD(tableName) {
  if (!tableName) {
    console.error('❌ Please provide a table name');
    console.log('Usage: node scripts/generate-crud.js [table-name]');
    process.exit(1);
  }

  // Convert table name to singular
  const singularName = tableName.endsWith('s') 
    ? tableName.slice(0, -1) 
    : tableName;

  const templates = generateCRUDTemplate(tableName, singularName);

  // Create directories if they don't exist
  const dirs = [
    path.join(process.cwd(), 'src/types'),
    path.join(process.cwd(), 'src/lib/api'),
    path.join(process.cwd(), 'src/hooks'),
    path.join(process.cwd(), 'src/components/admin'),
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Write files
  const files = [
    { path: `src/types/${tableName}.ts`, content: templates.types },
    { path: `src/lib/api/${tableName}.ts`, content: templates.api },
    { path: `src/hooks/use-${tableName}.ts`, content: templates.hooks },
    { path: `src/components/admin/${tableName}-manager.tsx`, content: templates.component },
  ];

  files.forEach(file => {
    const filePath = path.join(process.cwd(), file.path);
    fs.writeFileSync(filePath, file.content);
    console.log(`✅ Generated: ${file.path}`);
  });

  console.log(`
🎉 CRUD operations generated successfully for "${tableName}"!

Files created:
- src/types/${tableName}.ts
- src/lib/api/${tableName}.ts
- src/hooks/use-${tableName}.ts
- src/components/admin/${tableName}-manager.tsx

Next steps:
1. Update the types in src/types/${tableName}.ts with your actual fields
2. Import and use the component in your admin page
3. Make sure your Supabase table has the correct RLS policies
`);
}

// Run the generator
const tableName = process.argv[2];
generateCRUD(tableName);
