import pool from './config/database';

async function initDB() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        bio TEXT DEFAULT '',
        level VARCHAR(20) DEFAULT 'Beginner',
        xp INTEGER DEFAULT 0,
        streak INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        color VARCHAR(10) DEFAULT '#38BDF8',
        lesson_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS modules (
        id SERIAL PRIMARY KEY,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        duration VARCHAR(50) NOT NULL,
        sort_order INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS quizzes (
        id SERIAL PRIMARY KEY,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        options JSONB NOT NULL,
        correct_index INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        xp_reward INTEGER DEFAULT 0,
        due_days INTEGER DEFAULT 7,
        requirements JSONB DEFAULT '[]',
        tips JSONB DEFAULT '[]',
        color VARCHAR(10) DEFAULT '#38BDF8'
      );

      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        icon VARCHAR(50) NOT NULL,
        color VARCHAR(10) DEFAULT '#38BDF8',
        resource_count INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS resources (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        type VARCHAR(50) NOT NULL,
        author VARCHAR(150) NOT NULL,
        description TEXT DEFAULT '',
        content TEXT DEFAULT '',
        downloads INTEGER DEFAULT 0,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        color VARCHAR(10) DEFAULT '#38BDF8'
      );

      CREATE TABLE IF NOT EXISTS mentors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(100) NOT NULL,
        expertise JSONB DEFAULT '[]',
        students INTEGER DEFAULT 0,
        rating DECIMAL(2,1) DEFAULT 0.0,
        available BOOLEAN DEFAULT true
      );

      CREATE TABLE IF NOT EXISTS faqs (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS user_enrollments (
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        enrolled_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (user_id, course_id)
      );

      CREATE TABLE IF NOT EXISTS user_progress (
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
        completed_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (user_id, module_id)
      );

      CREATE TABLE IF NOT EXISTS user_submissions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        link TEXT NOT NULL,
        note TEXT DEFAULT '',
        status VARCHAR(20) DEFAULT 'pending',
        feedback TEXT DEFAULT '',
        submitted_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS user_bookmarks (
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
        saved_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (user_id, resource_id)
      );

      CREATE TABLE IF NOT EXISTS user_achievements (
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        achievement_key VARCHAR(50) NOT NULL,
        earned_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (user_id, achievement_key)
      );

      CREATE TABLE IF NOT EXISTS discussions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category VARCHAR(50) DEFAULT 'Diskusi',
        title VARCHAR(300) NOT NULL,
        body TEXT NOT NULL,
        replies_count INTEGER DEFAULT 0,
        likes_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS discussion_comments (
        id SERIAL PRIMARY KEY,
        discussion_id INTEGER REFERENCES discussions(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        body TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS discussion_likes (
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        discussion_id INTEGER REFERENCES discussions(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (user_id, discussion_id)
      );
    `);

    await client.query('COMMIT');
    console.log('Database schema created successfully');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error creating schema:', e);
    throw e;
  } finally {
    client.release();
  }
}

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query('DELETE FROM discussion_likes');
    await client.query('DELETE FROM discussion_comments');
    await client.query('DELETE FROM discussions');
    await client.query('DELETE FROM user_achievements');
    await client.query('DELETE FROM user_bookmarks');
    await client.query('DELETE FROM user_submissions');
    await client.query('DELETE FROM user_progress');
    await client.query('DELETE FROM user_enrollments');
    await client.query('DELETE FROM questions');
    await client.query('DELETE FROM quizzes');
    await client.query('DELETE FROM modules');
    await client.query('DELETE FROM resources');
    await client.query('DELETE FROM categories');
    await client.query('DELETE FROM faqs');
    await client.query('DELETE FROM mentors');
    await client.query('DELETE FROM projects');
    await client.query('DELETE FROM courses');
    await client.query('DELETE FROM users');

    await client.query(`INSERT INTO users (name, email, password_hash, bio, level, xp, streak) VALUES
      ('Rizki Pratama', 'rizki@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Frontend developer pemula yang sedang belajar React Native.', 'Intermediate', 4850, 7),
      ('Sari Dewi', 'sari@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Frontend developer passionate about UI/UX.', 'Expert', 4200, 12),
      ('Dimas Ardian', 'dimas@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Fullstack developer. Suka Node.js dan React.', 'Advanced', 3980, 5),
      ('Maya Putri', 'maya@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mobile developer. Flutter & React Native enthusiast.', 'Advanced', 3650, 9),
      ('Alex Supriadi', 'alex@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'UI/UX Designer yang belajar coding.', 'Intermediate', 3210, 3),
      ('Bambang', 'bambang@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Backend developer. Node.js & PostgreSQL.', 'Intermediate', 2980, 4),
      ('Citra Lestari', 'citra@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mobile developer. React Native & Firebase.', 'Intermediate', 2750, 6),
      ('Rina Wijaya', 'rina@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Pemula yang antusias belajar programming.', 'Beginner', 2420, 2)
    `);

    await client.query(`INSERT INTO courses (title, description, category, color, lesson_count) VALUES
      ('HTML & CSS Dasar', 'Pelajari fundamental web development mulai dari struktur HTML hingga styling dengan CSS. Cocok untuk pemula yang ingin membangun website pertamanya.', 'Frontend', '#38BDF8', 12),
      ('JavaScript Modern (ES6+)', 'Kuasai JavaScript modern dari dasar hingga mahir. Materi mencakup ES6+, asynchronous programming, dan studi kasus nyata.', 'Frontend', '#F59E0B', 8),
      ('React Native Pemula', 'Membangun aplikasi mobile cross-platform dengan React Native. Dari component dasar hingga navigasi dan state management.', 'Mobile', '#10B981', 10),
      ('Node.js & Express', 'Backend API development dengan Node.js dan Express. Membangun REST API yang robust dan terstruktur.', 'Backend', '#A78BFA', 8),
      ('UI/UX Design Dasar', 'Prinsip desain yang efektif. Color theory, typography, layout, dan prototyping dengan Figma.', 'UI/UX', '#EC4899', 6),
      ('Database dengan PostgreSQL', 'SQL fundamentals dan database design. Dari query dasar hingga optimization dan indexing.', 'Database', '#06B6D4', 7)
    `);

    await client.query(`INSERT INTO modules (course_id, title, duration, sort_order) VALUES
      (1, 'Pengenalan HTML', '15 menit', 1), (1, 'Tag & Elemen HTML', '20 menit', 2),
      (1, 'CSS Selectors & Properties', '25 menit', 3), (1, 'Flexbox & Grid', '30 menit', 4),
      (1, 'Responsive Design', '25 menit', 5), (1, 'Project: Landing Page', '45 menit', 6),
      (2, 'Variabel & Tipe Data', '15 menit', 1), (2, 'Function & Arrow Function', '20 menit', 2),
      (2, 'Array & Object', '25 menit', 3), (2, 'DOM Manipulation', '30 menit', 4),
      (2, 'Async/Await & Fetch API', '25 menit', 5), (2, 'ES6 Modules', '20 menit', 6),
      (2, 'Studi Kasus: Todo App', '40 menit', 7), (2, 'Final Project', '60 menit', 8),
      (3, 'Pengenalan React Native', '20 menit', 1), (3, 'Components & Props', '25 menit', 2),
      (3, 'State & Lifecycle', '30 menit', 3), (3, 'Styling di React Native', '20 menit', 4),
      (3, 'Navigasi', '35 menit', 5), (3, 'FlatList & ScrollView', '25 menit', 6),
      (3, 'Networking & API', '30 menit', 7), (3, 'Storage & Persistence', '25 menit', 8),
      (3, 'Project: Aplikasi Todo', '45 menit', 9), (3, 'Deploy ke Play Store', '60 menit', 10),
      (4, 'Pengenalan Node.js', '15 menit', 1), (4, 'Express.js Dasar', '20 menit', 2),
      (4, 'REST API Design', '25 menit', 3), (4, 'Middleware & Error Handling', '20 menit', 4),
      (4, 'Database Integration', '30 menit', 5), (4, 'Authentication & JWT', '35 menit', 6),
      (4, 'Testing', '25 menit', 7), (4, 'Deployment', '40 menit', 8),
      (5, 'Color Theory', '20 menit', 1), (5, 'Typography', '15 menit', 2),
      (5, 'Layout & Composition', '25 menit', 3), (5, 'Prototyping dengan Figma', '30 menit', 4),
      (5, 'Design System', '20 menit', 5), (5, 'Project: Redesign App', '45 menit', 6),
      (6, 'Pengenalan SQL', '15 menit', 1), (6, 'CRUD Operations', '20 menit', 2),
      (6, 'Joins & Relationships', '25 menit', 3), (6, 'Indexes & Performance', '20 menit', 4),
      (6, 'Database Design', '30 menit', 5), (6, 'Migrations & Seeding', '20 menit', 6),
      (6, 'Project: Design Database', '40 menit', 7)
    `);

    await client.query(`INSERT INTO quizzes (course_id, title) VALUES
      (1, 'Kuis HTML & CSS Dasar'), (2, 'Kuis JavaScript ES6+')`);

    await client.query(`INSERT INTO questions (quiz_id, question_text, options, correct_index) VALUES
      (1, 'Apa kepanjangan dari HTML?', '["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyper Transfer Markup Language"]', 0),
      (1, 'Tag HTML mana yang digunakan untuk membuat heading terbesar?', '["<head>", "<h6>", "<h1>", "<header>"]', 2),
      (1, 'Property CSS apa yang digunakan untuk mengatur warna teks?', '["background-color", "color", "font-color", "text-color"]', 1),
      (1, 'Apa fungsi dari CSS Flexbox?', '["Membuat animasi", "Mengatur layout responsif", "Menyambung ke database", "Membuat form"]', 1),
      (2, 'Keyword apa yang digunakan untuk mendeklarasikan variabel di ES6?', '["var", "let & const", "int", "string"]', 1),
      (2, 'Method array mana yang digunakan untuk memfilter data?', '["map()", "filter()", "reduce()", "forEach()"]', 1),
      (2, 'Apa output dari: console.log(typeof "Hello")?', '["string", "number", "object", "undefined"]', 0),
      (2, 'Arrow function ditulis dengan simbol apa?', '["=>", "->", "::", "=|>"]', 0)
    `);

    await client.query(`INSERT INTO projects (title, description, xp_reward, due_days, requirements, tips, color) VALUES
      ('Membuat Landing Page Responsive', 'Bangun halaman landing page yang responsif menggunakan HTML semantik dan CSS modern. Halaman harus memiliki navigasi, hero section, fitur, dan footer.', 150, 1, '["Menggunakan HTML5 semantic tags (header, nav, main, section, footer)", "CSS Flexbox atau Grid untuk layout", "Responsif di mobile (min-width 320px) dan desktop", "Minimal 3 section: Hero, Features, Contact", "Warna dan font yang konsisten"]', '["Gunakan mobile-first approach", "Manfaatkan CSS custom properties untuk warna", "Pastikan aksesibilitas dengan alt text pada gambar"]', '#F59E0B'),
      ('Aplikasi Todo-List dengan DOM JavaScript', 'Manipulasi DOM untuk menambah, menghapus, dan mencentang tugas. Gunakan event delegation dan localStorage.', 200, 3, '["Menambah tugas baru", "Menghapus tugas", "Mencentang tugas selesai", "Menyimpan data di localStorage", "UI yang bersih dan intuitif"]', '["Pisahkan logic dan DOM manipulation", "Gunakan event delegation", "Tambahkan animasi transisi"]', '#3B82F6'),
      ('Website Portofolio Pribadi', 'Bangun website portofolio responsif dengan HTML, CSS, dan JavaScript. Tampilkan project, skills, dan contact.', 250, 7, '["Halaman About, Projects, Contact", "Responsive design", "Dark/light mode toggle", "Form kontak yang berfungsi", "Animasi scroll halus"]', '["Gunakan Intersection Observer untuk animasi", "Optimasi gambar dengan lazy loading", "Tambahkan meta tags untuk SEO"]', '#10B981'),
      ('API Sederhana dengan Node.js', 'Buat REST API dengan Express.js dan hubungkan ke database PostgreSQL. Implementasikan CRUD lengkap.', 300, 14, '["Endpoint CRUD untuk minimal 2 resource", "Error handling yang baik", "Input validation", "Authentication JWT", "Documentation API"]', '["Gunakan async/await", "Implementasi proper error codes", "Gunakan environment variables"]', '#64748B')
    `);

    await client.query(`INSERT INTO categories (name, icon, color, resource_count) VALUES
      ('HTML & CSS', 'language-html5', '#38BDF8', 12), ('JavaScript', 'language-javascript', '#F59E0B', 15),
      ('TypeScript', 'language-typescript', '#3B82F6', 8), ('React', 'react', '#10B981', 10),
      ('React Native', 'cellphone', '#6366F1', 9), ('Node.js', 'nodejs', '#84CC16', 7),
      ('Database', 'database', '#06B6D4', 6), ('UI/UX Design', 'palette', '#EC4899', 5),
      ('Git & GitHub', 'git', '#F97316', 4), ('Tools & DevOps', 'tools', '#A78BFA', 5)
    `);

    await client.query(`INSERT INTO resources (title, type, author, description, content, downloads, category_id, color) VALUES
      ('Belajar HTML dalam 1 Jam', 'Ebook', 'SkillUps', 'Panduan lengkap HTML untuk pemula. Pelajari semua tag penting dan cara menggunakannya.', 'HTML (HyperText Markup Language) adalah bahasa markup standar untuk membuat halaman web. Dalam ebook ini, kamu akan mempelajari: struktur dokumen HTML, tag-tag penting seperti heading, paragraph, link, image, list, dan form. Setiap bagian dilengkapi dengan contoh kode yang bisa langsung dicoba.', 1240, 1, '#38BDF8'),
      ('CSS Cheatsheet Lengkap', 'PDF', 'Frontend Masters', 'Referensi cepat untuk semua properti CSS yang sering digunakan.', 'Cheatsheet ini mencakup: Box Model, Flexbox, Grid, Typography, Colors, Transitions, dan Responsive Design. Cocok untuk dijadikan referensi saat coding.', 980, 1, '#A78BFA'),
      ('JavaScript: The Good Parts', 'Ebook', 'Douglas Crockford', 'Buku klasik tentang bagian terbaik dari JavaScript.', 'JavaScript memiliki fitur-fitur canggih yang sering tidak dimanfaatkan dengan baik. Buku ini membahas bagian-bagian terbaik dari JavaScript dan cara menggunakannya dengan efektif.', 2100, 2, '#F59E0B'),
      ('React Native Documentation', 'Link', 'Meta', 'Dokumentasi resmi React Native dari Meta.', 'Documentation lengkap React Native mencakup: getting started, components, APIs, guides, dan architecture. Selalu updated dengan versi terbaru.', 3500, 5, '#10B981'),
      ('Desain Sistem Figma Kit', 'File', 'Design Community', 'Template Figma untuk membangun design system.', 'Figma kit lengkap dengan: color palette, typography scale, component library, icon set, dan spacing system. Siap digunakan untuk project apapun.', 760, 8, '#EC4899'),
      ('API Testing dengan Postman', 'Guide', 'Postman', 'Panduan lengkap testing REST API dengan Postman.', 'Pelajari cara membuat collection, environment variables, assertions, dan automation testing. Cocok untuk backend developer.', 540, 6, '#06B6D4'),
      ('TypeScript Handbook', 'Ebook', 'Microsoft', 'Panduan resmi TypeScript dari Microsoft.', 'TypeScript menambahkan static typing ke JavaScript. Handbook ini menjelaskan: types, interfaces, generics, modules, dan best practices.', 1800, 3, '#3B82F6'),
      ('Node.js Best Practices', 'Guide', 'Goldbergyoni', 'Kumpulan best practices untuk Node.js development.', 'Covers: project structure, error handling, logging, security, testing, dan performance optimization untuk Node.js applications.', 920, 6, '#84CC16')
    `);

    await client.query(`INSERT INTO mentors (name, role, expertise, students, rating, available) VALUES
      ('Ahmad Riza', 'Senior Frontend Engineer', '["React", "TypeScript", "CSS"]', 234, 4.9, true),
      ('Diana Putri', 'UI/UX Designer', '["Figma", "Design System", "Prototyping"]', 189, 4.8, false),
      ('Budi Santoso', 'Backend Developer', '["Node.js", "PostgreSQL", "AWS"]', 156, 4.7, true),
      ('Citra Lestari', 'Mobile Developer', '["React Native", "Flutter", "Firebase"]', 201, 4.9, true)
    `);

    await client.query(`INSERT INTO faqs (question, answer, sort_order) VALUES
      ('Bagaimana cara memulai kursus?', 'Pilih kursus dari halaman Home atau Library, lalu klik "Mulai Belajar" untuk mengakses materi pertama.', 1),
      ('Apakah sertifikat bisa diunduh?', 'Ya, sertifikat bisa diunduh dalam format PDF setelah menyelesaikan 100% materi kursus.', 2),
      ('Bagaimana cara mengumpulkan tugas?', 'Buka tab Projects, pilih tugas yang aktif, lalu klik "Kumpulkan Proyek" dan unggah link hasil kerja kamu.', 3),
      ('Berapa lama waktu review tugas?', 'Mentor akan mereview tugas dalam 1-3 hari kerja. Kamu akan mendapat notifikasi setelah selesai.', 4),
      ('Apakah aplikasi ini gratis?', 'Ya, semua materi dasar bisa diakses gratis. Ada opsi premium untuk fitur tambahan seperti konsultasi mentor.', 5)
    `);

    await client.query(`INSERT INTO discussions (user_id, category, title, body, replies_count, likes_count) VALUES
      (5, 'Diskusi', 'Ada yang tahu kombinasi font bagus untuk portofolio?', 'Lagi bikin portofolio studi kasus. Bagusnya pakai Inter + Playfair Display atau Montserrat + Roboto ya?', 12, 24),
      (2, 'Tips & Trik', 'Tips debugging React Native yang sering muncul', 'Setelah beberapa bulan pakai RN, ini dia error yang paling sering saya temui dan cara ngatasinnya. Semoga membantu teman-teman!', 8, 45),
      (6, 'Tanya Jawab', 'REST API vs GraphQL, mana yang harus dipelajari?', 'Untuk pemula yang baru mau belajar backend, lebih baik mulai dari REST API dulu atau langsung GraphQL?', 19, 32),
      (4, 'Showcase', 'Berhasil deploy aplikasi pertama ke Play Store!', 'Setelah 3 bulan belajar, akhirnya aplikasi pertama saya terbit di Play Store. Terima kasih SkillUps!', 30, 67)
    `);

    await client.query(`INSERT INTO discussion_comments (discussion_id, user_id, body) VALUES
      (1, 2, 'Inter + Playfair Display bagus untuk portofolio yang elegan. Tapi kalau mau lebih modern, coba Plus Jakarta Sans.'),
      (1, 3, 'Saya pakai DM Sans + Space Grotesk, hasilnya clean dan profesional.'),
      (1, 4, 'Kalau untuk developer, JetBrains Mono + Inter kombinasi yang keren.'),
      (2, 1, 'Error "Cannot read property of undefined" paling sering muncul di saya. Tips-nya sangat membantu!'),
      (2, 3, 'Error merah di React Native memang bikin pusing. Thanks sharingnya Sari!'),
      (3, 1, 'Mulai dari REST API dulu lebih baik. Konsepnya lebih simple dan foundation yang bagus sebelum ke GraphQL.'),
      (3, 4, 'Setuju REST API dulu. GraphQL lebih cocok untuk project yang sudah besar.'),
      (4, 1, 'Selamat Maya! Aplikasi apa yang di-publish?'),
      (4, 5, 'Keren! Semoga bisa menyusul. Terima kasih sudah sharing pengalamannya.')
    `);

    await client.query(`INSERT INTO user_enrollments (user_id, course_id) VALUES
      (1, 1), (1, 2), (1, 3), (1, 4),
      (2, 1), (2, 2), (2, 3),
      (3, 1), (3, 2),
      (4, 3), (4, 5)
    `);

    await client.query(`INSERT INTO user_progress (user_id, module_id) VALUES
      (1, 1), (1, 2), (1, 3), (1, 4), (1, 7), (1, 8), (1, 9), (1, 10), (1, 11), (1, 15), (1, 16), (1, 17),
      (2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8), (2, 9), (2, 10), (2, 11),
      (3, 1), (3, 2), (3, 3), (3, 7), (3, 8)
    `);

    await client.query(`INSERT INTO user_submissions (user_id, project_id, link, note, status, feedback) VALUES
      (1, 2, 'https://github.com/rizki/todo-list', 'Ini adalah aplikasi Todo-List pertama saya.', 'review', ''),
      (1, 1, 'https://rizki.github.io/landing-page/', 'Landing page responsive dengan HTML CSS.', 'approved', 'Bagus! Struktur HTML sudah semantic. CSS-nya clean.'),
      (4, 1, 'https://maya.github.io/portfolio/', 'Redesign landing page untuk portofolio.', 'revision', 'Perlu perbaikan di bagian mobile responsiveness.')
    `);

    await client.query(`INSERT INTO user_bookmarks (user_id, resource_id) VALUES
      (1, 3), (1, 2), (1, 4), (2, 1), (2, 7), (3, 3), (3, 8)
    `);

    await client.query(`INSERT INTO user_achievements (user_id, achievement_key) VALUES
      (1, 'first_step'), (1, 'on_fire'), (1, 'html_master'),
      (2, 'first_step'), (2, 'on_fire'), (2, 'html_master'), (2, 'js_ninja'),
      (3, 'first_step'), (3, 'html_master'),
      (4, 'first_step'), (4, 'on_fire'), (4, 'mobile_dev')
    `);

    await client.query('COMMIT');
    console.log('Seed data inserted successfully');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error seeding data:', e);
    throw e;
  } finally {
    client.release();
  }
}

async function main() {
  try {
    console.log('Initializing database schema...');
    await initDB();
    console.log('Seeding data...');
    await seed();
    console.log('Done!');
    process.exit(0);
  } catch (e) {
    console.error('Failed:', e);
    process.exit(1);
  }
}

main();
