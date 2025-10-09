/**
 * Runner para executar migrações standalone
 * Usado pelo script de deploy do Railway
 */

import { ensureDatabaseSetup } from './migrate';
import { seedCategories } from './seed-categories';

async function run() {
  try {
    console.log('Executando configuração do banco de dados...\n');
    
    // 1. Configurar banco de dados
    await ensureDatabaseSetup();
    
    // 2. Seed de categorias
    await seedCategories();
    
    console.log('\n✅ Configuração concluída!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    // Não falhar - deixar o servidor tentar mesmo com erro
    process.exit(0);
  }
}

run();
