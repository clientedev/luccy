import { pool, db } from './db';
import { sql } from 'drizzle-orm';

/**
 * Este arquivo garante que o banco de dados PostgreSQL esteja configurado corretamente
 * Executa automaticamente ao iniciar o servidor para corrigir problemas comuns
 */

export async function ensureDatabaseSetup() {
  try {
    console.log('🔧 Verificando configuração do banco de dados...');

    // 1. Garantir que a extensão UUID está habilitada
    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `);
    console.log('✓ Extensão pgcrypto habilitada');

    // 2. Verificar se as tabelas existem
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE';
    `);

    const tableNames = tables.rows.map((row: { table_name: string }) => row.table_name);
    console.log('✓ Tabelas encontradas:', tableNames.join(', '));

    // 3. Garantir que gen_random_uuid() está disponível (fallback)
    try {
      await pool.query(`SELECT gen_random_uuid()`);
      console.log('✓ Função gen_random_uuid() disponível');
    } catch {
      console.log('⚠ gen_random_uuid() não disponível, usando uuid_generate_v4()');
      await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    }

    // 4. Verificar integridade das foreign keys
    const fkCheck = await pool.query(`
      SELECT 
        tc.table_name, 
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND tc.table_schema = 'public';
    `);

    console.log(`✓ ${fkCheck.rows.length} foreign keys verificadas`);

    // 5. Criar índices para melhorar performance
    const indexQueries = [
      `CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);`,
      `CREATE INDEX IF NOT EXISTS idx_appointments_service ON appointments(service_id);`,
      `CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);`,
      `CREATE INDEX IF NOT EXISTS idx_service_hours_service ON service_hours(service_id);`,
      `CREATE INDEX IF NOT EXISTS idx_service_hours_day ON service_hours(day_of_week);`,
      `CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);`,
      `CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(approved);`,
      `CREATE INDEX IF NOT EXISTS idx_gallery_featured ON gallery_images(featured);`,
    ];

    for (const query of indexQueries) {
      try {
        await pool.query(query);
      } catch (err) {
        // Índice pode já existir, não é crítico
      }
    }
    console.log('✓ Índices criados/verificados');

    // 6. Verificar se há problemas com valores NULL em colunas obrigatórias
    const nullChecks = [
      { table: 'services', columns: ['name'] },
      { table: 'appointments', columns: ['client_name', 'client_phone', 'service_id', 'appointment_date', 'appointment_time'] },
      { table: 'testimonials', columns: ['client_name', 'content'] },
    ];

    for (const check of nullChecks) {
      for (const column of check.columns) {
        const result = await pool.query(`
          SELECT COUNT(*) as count 
          FROM ${check.table} 
          WHERE ${column} IS NULL;
        `);
        
        if (parseInt(result.rows[0].count) > 0) {
          console.log(`⚠ Aviso: ${result.rows[0].count} registros com ${column} NULL em ${check.table}`);
        }
      }
    }

    console.log('✅ Banco de dados verificado e configurado com sucesso!\n');
    return true;
  } catch (error) {
    console.error('❌ Erro ao configurar banco de dados:', error);
    // Não lançar erro - permitir que o servidor continue
    return false;
  }
}

/**
 * Função para limpar dados órfãos (opcional)
 */
export async function cleanOrphanedData() {
  try {
    console.log('🧹 Limpando dados órfãos...');

    // Remover service_hours de serviços que não existem mais
    const orphanedHours = await pool.query(`
      DELETE FROM service_hours 
      WHERE service_id NOT IN (SELECT id FROM services)
      RETURNING id;
    `);

    if (orphanedHours.rows.length > 0) {
      console.log(`✓ Removidos ${orphanedHours.rows.length} horários órfãos`);
    }

    // Remover appointments de serviços que não existem mais
    const orphanedAppointments = await pool.query(`
      DELETE FROM appointments 
      WHERE service_id NOT IN (SELECT id FROM services)
      RETURNING id;
    `);

    if (orphanedAppointments.rows.length > 0) {
      console.log(`✓ Removidos ${orphanedAppointments.rows.length} agendamentos órfãos`);
    }

    // Remover produtos de categorias que não existem mais
    const orphanedProducts = await pool.query(`
      UPDATE products 
      SET category_id = NULL 
      WHERE category_id IS NOT NULL 
      AND category_id NOT IN (SELECT id FROM categories);
    `);

    if (orphanedProducts.rowCount && orphanedProducts.rowCount > 0) {
      console.log(`✓ Corrigidos ${orphanedProducts.rowCount} produtos com categoria inválida`);
    }

    console.log('✅ Limpeza de dados concluída!\n');
  } catch (error) {
    console.error('❌ Erro ao limpar dados órfãos:', error);
  }
}

/**
 * Diagnóstico completo do banco de dados
 */
export async function diagnoseDatabaseIssues() {
  try {
    console.log('\n📊 DIAGNÓSTICO DO BANCO DE DADOS\n');
    console.log('================================\n');

    // Contar registros em cada tabela
    const tables = ['users', 'categories', 'products', 'services', 'service_hours', 'appointments', 'testimonials', 'gallery_images', 'site_settings'];
    
    for (const table of tables) {
      try {
        const result = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`${table.padEnd(20)} : ${result.rows[0].count} registros`);
      } catch (err) {
        console.log(`${table.padEnd(20)} : Tabela não encontrada`);
      }
    }

    console.log('\n================================\n');

    // Verificar serviços sem horários
    const servicesWithoutHours = await pool.query(`
      SELECT s.id, s.name 
      FROM services s 
      LEFT JOIN service_hours sh ON s.id = sh.service_id 
      WHERE sh.id IS NULL
    `);

    if (servicesWithoutHours.rows.length > 0) {
      console.log('⚠ Serviços sem horários definidos:');
      servicesWithoutHours.rows.forEach((row: any) => {
        console.log(`  - ${row.name} (${row.id})`);
      });
      console.log();
    }

    // Verificar agendamentos com status
    const appointmentStats = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM appointments 
      GROUP BY status
    `);

    if (appointmentStats.rows.length > 0) {
      console.log('📅 Status dos agendamentos:');
      appointmentStats.rows.forEach((row: any) => {
        console.log(`  - ${row.status}: ${row.count}`);
      });
      console.log();
    }

    // Verificar depoimentos aprovados vs pendentes
    const testimonialStats = await pool.query(`
      SELECT approved, COUNT(*) as count 
      FROM testimonials 
      GROUP BY approved
    `);

    if (testimonialStats.rows.length > 0) {
      console.log('💬 Status dos depoimentos:');
      testimonialStats.rows.forEach((row: any) => {
        console.log(`  - ${row.approved ? 'Aprovados' : 'Pendentes'}: ${row.count}`);
      });
      console.log();
    }

    console.log('================================\n');
  } catch (error) {
    console.error('❌ Erro no diagnóstico:', error);
  }
}
