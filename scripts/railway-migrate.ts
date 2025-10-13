#!/usr/bin/env node
/**
 * Script de migração para Railway
 * Executa ANTES do servidor iniciar para preparar o banco de dados
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runMigration() {
  console.log('🚀 Iniciando migração do banco de dados para Railway...\n');

  try {
    // 1. Verificar se DATABASE_URL está configurado
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL não está configurado! Certifique-se de ter um PostgreSQL vinculado ao projeto no Railway.');
    }

    console.log('✓ DATABASE_URL encontrado');

    // 2. Executar drizzle-kit push para sincronizar schema
    console.log('\n📦 Sincronizando schema do banco de dados...');
    try {
      const { stdout, stderr } = await execAsync('npx drizzle-kit push --force');
      if (stdout) console.log(stdout);
      if (stderr && !stderr.includes('warn')) console.error(stderr);
      console.log('✓ Schema sincronizado com sucesso');
    } catch (error: any) {
      // Se falhar, tentar sem --force
      console.log('⚠ Tentando sem --force...');
      const { stdout, stderr } = await execAsync('npx drizzle-kit push');
      if (stdout) console.log(stdout);
      if (stderr && !stderr.includes('warn')) console.error(stderr);
      console.log('✓ Schema sincronizado com sucesso');
    }

    // 3. Executar verificação e configuração do banco (migrate.ts)
    console.log('\n🔧 Configurando banco de dados...');
    const { stdout: migrateOut } = await execAsync('tsx server/migrate-runner.ts');
    if (migrateOut) console.log(migrateOut);

    console.log('\n✅ Migração concluída com sucesso!');
    console.log('🎉 Banco de dados pronto para uso!\n');
    
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Erro durante a migração:');
    console.error(error.message);
    if (error.stdout) console.log('stdout:', error.stdout);
    if (error.stderr) console.log('stderr:', error.stderr);
    
    // FAIL FAST: Stop deployment if migrations fail
    // This prevents deploying with outdated/broken database schema
    console.log('\n❌ Deploy abortado devido a erro na migração.');
    console.log('💡 Corrija os erros de migração antes de fazer deploy novamente.');
    process.exit(1); // Exit with error code to block Railway deployment
  }
}

runMigration();
