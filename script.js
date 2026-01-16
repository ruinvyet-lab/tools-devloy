async function deployToVercel() {
    const apiToken = document.getElementById('apiToken').value;
    const projectName = document.getElementById('projectName').value;
    const fileInput = document.getElementById('fileInput');
    const status = document.getElementById('status');
    const btn = document.getElementById('deployBtn');

    if (!apiToken || !projectName || !fileInput.files[0]) {
        alert("Isi API Token, Nama Project, dan Pilih File ZIP!");
        return;
    }

    // Nama domain kustom (slug)
    const slugName = projectName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    status.innerHTML = `<span style="color: #0070f3;">⏳ Memulai proses deploy: ${slugName}.vercel.app...</span>`;
    btn.disabled = true;

    const file = fileInput.files[0];

    try {
        // Step 1: Deploy ke Vercel API
        // Kita menggunakan method POST dengan body mentah (binary)
        const response = await fetch(`https://api.vercel.com/v13/deployments`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/zip', // Memberitahu Vercel ini adalah ZIP
            },
            body: file 
        });

        const data = await response.json();

        if (response.ok) {
            // Step 2: Mengatur Project Name agar sesuai keinginan
            // Secara default Vercel membuat nama random jika cuma upload file.
            // Kita arahkan ke URL hasil deploy
            status.innerHTML = `
                <div style="color: green; font-weight: bold; margin-bottom: 10px;">✅ BERHASIL DEPLOY!</div>
                <div style="background: #eee; padding: 10px; border-radius: 5px;">
                    <strong>Link Web:</strong> <br>
                    <a href="https://${data.url}" target="_blank">https://${data.url}</a>
                </div>
                <p style="font-size: 12px; color: #666; margin-top: 10px;">
                    Catatan: Vercel mungkin akan menambahkan angka unik di belakang nama jika nama "${slugName}" sudah dipakai orang lain.
                </p>
            `;
        } else {
            status.innerHTML = `<span style="color: red;">❌ Gagal: ${data.error.message}</span>`;
        }
    } catch (err) {
        status.innerHTML = `<span style="color: red;">❌ Terjadi kesalahan jaringan.</span>`;
        console.error(err);
    } finally {
        btn.disabled = false;
    }
}
