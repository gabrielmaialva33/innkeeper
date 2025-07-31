import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // Tables that need RLS policies (tenant-scoped)
    const tenantTables = [
      'hotels',
      'room_types',
      'rooms',
      'guests',
      'reservations',
      'payments',
      'staff',
      'services',
      'folios',
    ]

    // Enable RLS on tenant-scoped tables
    for (const table of tenantTables) {
      await this.db.rawQuery(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY`)

      // Create policy for SELECT
      await this.db.rawQuery(`
        CREATE POLICY ${table}_tenant_isolation_select ON ${table}
        FOR SELECT
        USING (organization_id = current_setting('app.current_organization')::integer)
      `)

      // Create policy for INSERT
      await this.db.rawQuery(`
        CREATE POLICY ${table}_tenant_isolation_insert ON ${table}
        FOR INSERT
        WITH CHECK (organization_id = current_setting('app.current_organization')::integer)
      `)

      // Create policy for UPDATE
      await this.db.rawQuery(`
        CREATE POLICY ${table}_tenant_isolation_update ON ${table}
        FOR UPDATE
        USING (organization_id = current_setting('app.current_organization')::integer)
        WITH CHECK (organization_id = current_setting('app.current_organization')::integer)
      `)

      // Create policy for DELETE
      await this.db.rawQuery(`
        CREATE POLICY ${table}_tenant_isolation_delete ON ${table}
        FOR DELETE
        USING (organization_id = current_setting('app.current_organization')::integer)
      `)
    }

    // Special handling for users table (optional organization_id)
    await this.db.rawQuery(`ALTER TABLE users ENABLE ROW LEVEL SECURITY`)

    await this.db.rawQuery(`
      CREATE POLICY users_tenant_isolation_select ON users
      FOR SELECT
      USING (
        organization_id IS NULL OR 
        organization_id = current_setting('app.current_organization', true)::integer
      )
    `)

    await this.db.rawQuery(`
      CREATE POLICY users_tenant_isolation_insert ON users
      FOR INSERT
      WITH CHECK (
        organization_id IS NULL OR 
        organization_id = current_setting('app.current_organization', true)::integer
      )
    `)

    await this.db.rawQuery(`
      CREATE POLICY users_tenant_isolation_update ON users
      FOR UPDATE
      USING (
        organization_id IS NULL OR 
        organization_id = current_setting('app.current_organization', true)::integer
      )
      WITH CHECK (
        organization_id IS NULL OR 
        organization_id = current_setting('app.current_organization', true)::integer
      )
    `)

    await this.db.rawQuery(`
      CREATE POLICY users_tenant_isolation_delete ON users
      FOR DELETE
      USING (
        organization_id IS NULL OR 
        organization_id = current_setting('app.current_organization', true)::integer
      )
    `)

    // Create a function to set the current organization
    await this.db.rawQuery(`
      CREATE OR REPLACE FUNCTION set_current_organization(org_id integer)
      RETURNS void AS $$
      BEGIN
        PERFORM set_config('app.current_organization', org_id::text, false);
      END;
      $$ LANGUAGE plpgsql;
    `)
  }

  async down() {
    // Drop the function
    await this.db.rawQuery(`DROP FUNCTION IF EXISTS set_current_organization(integer)`)

    // Tables that have RLS policies
    const allTables = [
      'users',
      'hotels',
      'room_types',
      'rooms',
      'guests',
      'reservations',
      'payments',
      'staff',
      'services',
      'folios',
    ]

    // Disable RLS and drop policies
    for (const table of allTables) {
      // Drop all policies
      await this.db.rawQuery(`
        DROP POLICY IF EXISTS ${table}_tenant_isolation_select ON ${table}
      `)
      await this.db.rawQuery(`
        DROP POLICY IF EXISTS ${table}_tenant_isolation_insert ON ${table}
      `)
      await this.db.rawQuery(`
        DROP POLICY IF EXISTS ${table}_tenant_isolation_update ON ${table}
      `)
      await this.db.rawQuery(`
        DROP POLICY IF EXISTS ${table}_tenant_isolation_delete ON ${table}
      `)

      // Disable RLS
      await this.db.rawQuery(`ALTER TABLE ${table} DISABLE ROW LEVEL SECURITY`)
    }
  }
}
