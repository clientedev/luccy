/**
 * Runner para executar migrações standalone
 * Usado pelo script de deploy do Railway
 */

import { ensureDatabaseSetup } from './migrate';
import { seedCategories } from './seed-categories';
import { storage } from './storage';

async function run() {
  try {
    console.log('Executando configuração do banco de dados...\n');
    
    // 1. Configurar banco de dados
    await ensureDatabaseSetup();
    
    // 2. Seed de categorias
    await seedCategories();
    
    // 3. Inicializar dados seed (serviços, horários, galeria)
    if (typeof (storage as any).initializeSeedData === 'function') {
      console.log('\n🌱 Inicializando dados seed...');
      await (storage as any).initializeSeedData();
      console.log('✅ Dados seed inicializados!');
    }
    
    console.log('\n✅ Configuração concluída!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    // FAIL FAST: Block deployment if database setup fails
    process.exit(1);
  }
}

run();
