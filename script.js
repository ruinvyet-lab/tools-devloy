async function deployToVercel() {
    const apiToken = document.getElementById('apiToken').value;
    const projectName = document.getElementById('projectName').value;
    const fileInput = document.getElementById('fileInput');
    const status = document.getElementById('status');
    const btn = document.getElementById('deployBtn');

    if (!apiToken || !projectName || !fileInput.files[0]) {
        alert("Mohon lengkapi semua field!");
        return;
    }

    // Validasi nama: hanya boleh huruf, angka, dan tanda strip
    const slugifiedName = projectName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    status.innerHTML = `<span style="color: blue;">Sedang memproses "${slugifiedName}.vercel.app"...</span>`;
    btn.disabled = true;

    const file = fileInput.files[0];

    try {
        const response = await fetch('https://api.vercel.com/v13/deployments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                // Nama proyek dikirim di header atau body tergantung tipe konten
                // Di sini kita gunakan query param untuk nama proyek
            },
            body: file 
        });

        // Catatan: Untuk setting nama proyek secara spesifik via API file tunggal, 
        // Vercel menggunakan query parameter 'name'
        const urlWithParams = `https://api.vercel.com/v13/deployments?name=${slugifiedName}`;
        
        const finalResponse = await fetch(urlWithParams, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
            },
            body: file
        });

        const data = await finalResponse.json();

        if (finalResponse.ok) {
            status.innerHTML = `
                <div style="color: green; font-weight: bold;">✅ Berhasil Dideploy!</div>
                <p>URL Proyek: <a href="https://${data.url}" target="_blank">https://${data.url}</a></p>
            `;
        } else {
            status.innerHTML = `<span style="color: red;">❌ Error: ${data.error.message}</span>`;
        }
    } catch (err) {
        status.innerText = "Koneksi gagal atau file terlalu besar.";
        console.error(err);
    } finally {
        btn.disabled = false;
    }
}