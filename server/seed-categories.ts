import { pool } from './db';

/**
 * Script para adicionar categorias ao banco de dados
 * Executado automaticamente durante o deploy
 */

export async function seedCategories() {
  try {
    console.log('🌱 Verificando categorias...');

    // Lista de categorias padrão
    const categories = [
      { name: 'Cílios', slug: 'cilios', description: 'Extensões de cílios fio a fio e volume russo' },
      { name: 'Maquiagem', slug: 'maquiagem', description: 'Maquiagem para eventos e dia a dia' },
      { name: 'Cabelo', slug: 'cabelo', description: 'Corte, coloração e mega hair' },
      { name: 'Unhas', slug: 'unhas', description: 'Nail art, esmaltação e design exclusivo' },
      { name: 'Roupas', slug: 'roupas', description: 'Roupas e acessórios de moda' },
    ];

    for (const category of categories) {
      // Verifica se a categoria já existe
      const existing = await pool.query(
        'SELECT id FROM categories WHERE slug = $1',
        [category.slug]
      );

      if (existing.rows.length === 0) {
        // Adiciona a categoria se não existir
        await pool.query(
          `INSERT INTO categories (id, name, slug, description, created_at) 
           VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
          [category.name, category.slug, category.description]
        );
        console.log(`✓ Categoria "${category.name}" adicionada`);
      } else {
        console.log(`✓ Categoria "${category.name}" já existe`);
      }
    }

    console.log('✅ Categorias verificadas e atualizadas!\n');
    return true;
  } catch (error) {
    console.error('❌ Erro ao adicionar categorias:', error);
    return false;
  }
}

// Permite executar o script diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCategories()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
