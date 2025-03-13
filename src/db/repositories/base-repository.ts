import { db } from '../index';
import { eq } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';

export class BaseRepository<T extends { id: string }> {
  constructor(private table: PgTable) {}

  async findAll(): Promise<T[]> {
    return db.select().from(this.table) as Promise<T[]>;
  }

  async findById(id: string): Promise<T | undefined> {
    const results = await db
      .select()
      .from(this.table)
      .where(eq(this.table.id as any, id))
      .limit(1);
    
    return results[0] as T | undefined;
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    const results = await db.insert(this.table).values(data as any).returning();
    return results[0] as T;
  }

  async update(id: string, data: Partial<Omit<T, 'id'>>): Promise<T | undefined> {
    const results = await db
      .update(this.table)
      .set({
        ...data,
        dateUpdated: new Date(),
      } as any)
      .where(eq(this.table.id as any, id))
      .returning();
    
    return results[0] as T | undefined;
  }

  async delete(id: string): Promise<boolean> {
    const results = await db
      .delete(this.table)
      .where(eq(this.table.id as any, id))
      .returning();
    
    return results.length > 0;
  }

  async findWithPagination(page: number = 1, pageSize: number = 10): Promise<{ data: T[], total: number }> {
    const offset = (page - 1) * pageSize;
    
    const data = await db
      .select()
      .from(this.table)
      .limit(pageSize)
      .offset(offset) as T[];
    
    const countResult = await db
      .select({ count: db.fn.count() })
      .from(this.table);
    
    const total = Number(countResult[0].count) || 0;
    
    return { data, total };
  }
} 