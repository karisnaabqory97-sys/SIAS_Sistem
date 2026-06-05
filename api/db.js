// ============================================
// API Route: /api/db
// Koneksi ke Neon PostgreSQL Database
// ============================================

import { neon } from '@neondatabase/serverless';

// Konfigurasi CORS
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
};

// Helper untuk validasi API Key
function isValidApiKey(request) {
    const apiKey = request.headers.get('x-api-key');
    const secret = process.env.API_SECRET_KEY;
    // Jika di environment tidak diset, maka sementara bypass (untuk dev)
    // Namun untuk produksi, ini wajib.
    if (!secret) return true; 
    return apiKey === secret;
}

// Handler untuk request
export async function GET(request) {
    const url = new URL(request.url);
    const table = url.searchParams.get('table') || 'siswa';
    const action = url.searchParams.get('action') || 'list';

    // Proteksi data sensitif pada GET
    if (['siswa', 'guru', 'kelas'].includes(table) && !isValidApiKey(request)) {
        return new Response(JSON.stringify({ success: false, error: 'Unauthorized: Invalid API Key' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }

    try {
        const sql = neon(process.env.DATABASE_URL);

        let result;

        switch (table) {
            case 'siswa':
                if (action === 'list') {
                    result = await sql`SELECT * FROM siswa ORDER BY created_at ASC`;
                } else if (action === 'stats') {
                    result = await sql`
                        SELECT
                            COUNT(*) as total_siswa,
                            COUNT(DISTINCT kelas) as total_kelas
                        FROM siswa
                    `;
                }
                break;

            case 'guru':
                result = await sql`SELECT * FROM guru ORDER BY created_at ASC`;
                break;

            case 'kelas':
                result = await sql`SELECT * FROM kelas ORDER BY nama`;
                break;

            case 'mapel':
                result = await sql`SELECT * FROM mata_pelajaran ORDER BY nama`;
                break;

            case 'informasi':
                result = await sql`SELECT * FROM informasi WHERE is_published = TRUE ORDER BY created_at DESC`;
                break;

            case 'jadwal':
                const kelas = url.searchParams.get('kelas');
                if (kelas) {
                    result = await sql`SELECT * FROM jadwal_pelajaran WHERE kelas = ${kelas} ORDER BY hari, jam_mulai`;
                } else {
                    result = await sql`SELECT * FROM jadwal_pelajaran ORDER BY hari, jam_mulai`;
                }
                break;

            case 'nilai':
                const siswaId = url.searchParams.get('siswa_id');
                if (siswaId) {
                    result = await sql`SELECT * FROM nilai WHERE siswa_id = ${siswaId} ORDER BY semester DESC`;
                } else {
                    result = await sql`SELECT * FROM nilai ORDER BY created_at DESC`;
                }
                break;

            default:
                result = await sql`SELECT 1 as test`;
        }

        return new Response(JSON.stringify({ success: true, data: result }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
}

export async function POST(request) {
    // Validasi API Key untuk semua operasi POST
    if (!isValidApiKey(request)) {
        return new Response(JSON.stringify({ success: false, error: 'Unauthorized: Invalid API Key' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }

    try {
        const body = await request.json();
        const { table, action, data } = body;

        const sql = neon(process.env.DATABASE_URL);
        let result;

        switch (table) {
            case 'siswa':
                if (action === 'insert') {
                    result = await sql`
                        INSERT INTO siswa (nisn, nama, jk, kelas, ayah, pekerjaan_ayah, ibu, pekerjaan_ibu, username, password, status)
                        VALUES (${data.nisn}, ${data.nama}, ${data.jk}, ${data.kelas},
                                ${data.ayah || ''}, ${data.pekerjaanAyah || ''},
                                ${data.ibu || ''}, ${data.pekerjaanIbu || ''},
                                ${data.username}, ${data.password}, ${data.status || 'Aktif'})
                        RETURNING *
                    `;
                } else if (action === 'update') {
                    result = await sql`
                        UPDATE siswa SET
                            nisn = ${data.nisn},
                            nama = ${data.nama},
                            jk = ${data.jk},
                            kelas = ${data.kelas},
                            ayah = ${data.ayah || ''},
                            pekerjaan_ayah = ${data.pekerjaanAyah || ''},
                            ibu = ${data.ibu || ''},
                            pekerjaan_ibu = ${data.pekerjaanIbu || ''},
                            username = ${data.username},
                            password = ${data.password},
                            status = ${data.status || 'Aktif'},
                            updated_at = NOW()
                        WHERE id = ${data.id}
                        RETURNING *
                    `;
                } else if (action === 'delete') {
                    await sql`DELETE FROM siswa WHERE id = ${data.id}`;
                    result = { deleted: true };
                }
                break;

            case 'guru':
                if (action === 'insert') {
                    result = await sql`
                        INSERT INTO guru (nuptk, nama, mapel, username, password, status)
                        VALUES (${data.nuptk}, ${data.nama}, ${data.mapel}, ${data.username}, ${data.password}, ${data.status || 'Aktif'})
                        RETURNING *
                    `;
                } else if (action === 'update') {
                    result = await sql`
                        UPDATE guru SET
                            nuptk = ${data.nuptk},
                            nama = ${data.nama},
                            mapel = ${data.mapel},
                            username = ${data.username},
                            password = ${data.password},
                            status = ${data.status || 'Aktif'},
                            updated_at = NOW()
                        WHERE id = ${data.id}
                        RETURNING *
                    `;
                } else if (action === 'delete') {
                    await sql`DELETE FROM guru WHERE id = ${data.id}`;
                    result = { deleted: true };
                }
                break;

            case 'mapel':
                if (action === 'insert') {
                    result = await sql`
                        INSERT INTO mata_pelajaran (nama, singkatan, deskripsi)
                        VALUES (${data.nama}, ${data.kode || data.singkatan}, ${data.kategori || data.deskripsi || ''})
                        RETURNING *
                    `;
                } else if (action === 'update') {
                    result = await sql`
                        UPDATE mata_pelajaran SET
                            nama = ${data.nama},
                            singkatan = ${data.kode || data.singkatan},
                            deskripsi = ${data.kategori || data.deskripsi || ''}
                        WHERE id = ${data.id}
                        RETURNING *
                    `;
                } else if (action === 'delete') {
                    await sql`DELETE FROM mata_pelajaran WHERE id = ${data.id}`;
                    result = { deleted: true };
                }
                break;

            case 'informasi':
                if (action === 'insert') {
                    result = await sql`
                        INSERT INTO informasi (judul, konten, kategori, pengirim, is_published)
                        VALUES (${data.judul}, ${data.konten}, ${data.kategori}, ${data.pengirim}, TRUE)
                        RETURNING *
                    `;
                } else if (action === 'update') {
                    result = await sql`
                        UPDATE informasi SET
                            judul = ${data.judul},
                            konten = ${data.konten},
                            kategori = ${data.kategori},
                            is_published = ${data.is_published || TRUE},
                            updated_at = NOW()
                        WHERE id = ${data.id}
                        RETURNING *
                    `;
                } else if (action === 'delete') {
                    await sql`DELETE FROM informasi WHERE id = ${data.id}`;
                    result = { deleted: true };
                }
                break;

            case 'kelas':
                if (action === 'insert') {
                    result = await sql`
                        INSERT INTO kelas (nama, kode, ruang, wali, siswa_count)
                        VALUES (${data.nama}, ${data.kode}, ${data.ruang}, ${data.wali}, ${parseInt(data.siswa) || 0})
                        RETURNING *
                    `;
                } else if (action === 'update') {
                    result = await sql`
                        UPDATE kelas SET
                            nama = ${data.nama},
                            kode = ${data.kode},
                            ruang = ${data.ruang},
                            wali = ${data.wali},
                            siswa_count = ${parseInt(data.siswa) || 0}
                        WHERE id = ${data.id}
                        RETURNING *
                    `;
                } else if (action === 'delete') {
                    await sql`DELETE FROM kelas WHERE id = ${data.id}`;
                    result = { deleted: true };
                }
                break;

            case 'login':
                // Login verification
                if (data.role === 'admin') {
                    result = await sql`
                        SELECT * FROM admin
                        WHERE username = ${data.username} AND password = ${data.password}
                    `;
                } else if (data.role === 'guru') {
                    result = await sql`
                        SELECT * FROM guru
                        WHERE username = ${data.username} AND password = ${data.password} AND status = 'Aktif'
                    `;
                } else if (data.role === 'siswa') {
                    result = await sql`
                        SELECT * FROM siswa
                        WHERE (username = ${data.username} OR nisn = ${data.username}) AND password = ${data.password} AND status = 'Aktif'
                    `;
                }
                break;

            default:
                result = { message: 'Unknown table or action' };
        }

        return new Response(JSON.stringify({ success: true, data: result }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
}

// Handle OPTIONS untuk CORS preflight
export async function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: corsHeaders
    });
}
