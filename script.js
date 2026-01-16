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

    const slugifiedName = projectName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    status.innerHTML = `<span style="color: blue;">Sedang memproses "${slugifiedName}"...</span>`;
    btn.disabled = true;

    const file = fileInput.files[0];

    try {
        // PERBAIKAN: Gunakan endpoint khusus untuk file biner tunggal
        // Dan pastikan header Content-Type adalah application/octet-stream
        const response = await fetch(`https://api.vercel.com/v13/deployments?name=${slugifiedName}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/octet-stream', // Penting agar tidak error Unsupported Media Type
            },
            body: file 
        });

        const data = await response.json();

        if (response.ok) {
            status.innerHTML = `
                <div style="color: green; font-weight: bold;">✅ Berhasil Dideploy!</div>
                <p>URL: <a href="https://${data.url}" target="_blank">https://${data.url}</a></p>
                <p><small>Project Name: ${slugifiedName}</small></p>
            `;
        } else {
            // Jika error karena nama sudah dipakai atau hal lain
            status.innerHTML = `<span style="color: red;">❌ Error: ${data.error.message}</span>`;
        }
    } catch (err) {
        status.innerText = "Terjadi kesalahan pada koneksi API.";
        console.error(err);
    } finally {
        btn.disabled = false;
    }
}
