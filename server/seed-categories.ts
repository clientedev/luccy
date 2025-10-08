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
      try {
        // Usa INSERT ... ON CONFLICT para evitar duplicatas
        const result = await pool.query(
          `INSERT INTO categories (id, name, slug, description, created_at) 
           VALUES (gen_random_uuid(), $1, $2, $3, NOW())
           ON CONFLICT (slug) DO NOTHING
           RETURNING id`,
          [category.name, category.slug, category.description]
        );

        if (result.rows.length > 0) {
          console.log(`✓ Categoria "${category.name}" adicionada`);
        } else {
          console.log(`✓ Categoria "${category.name}" já existe`);
        }
      } catch (error) {
        // Se mesmo com ON CONFLICT der erro, apenas avisa
        console.log(`✓ Categoria "${category.name}" já existe ou erro: ${error}`);
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
