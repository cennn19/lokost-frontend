async function checkAuth(){
    const checkLogin = await fetch('https://lokost-backend-production.up.railway.app/api/user/check', {
        credentials: 'include'
    });
    if(!checkLogin.ok) window.location.href = 'login.html';
}

checkAuth();

const inputBarang = document.getElementById("input-barang");
const inputHargaBarang = document.getElementById("harga-barang"); 
const satuanBarang = document.getElementById("satuan-barang");
const btnTambahBarang = document.getElementById("btn-tambah-barang");

btnTambahBarang.addEventListener('click', async function(){
    if(inputBarang.value === ''|| inputHargaBarang.value === '' || satuanBarang.value === ''){
        alert("data input logistik belum lengkap")
    }
    
    if(parseInt(inputHargaBarang.value) <= 0){
        alert("Nominal harus lebih dari 0")
        return;
    }else {
        const resLogistik = await fetch(`https://lokost-backend-production.up.railway.app/api/logistik`,{
            method : 'POST',
            headers : {
                'Content-type' : 'application/json',
            },
            credentials : 'include',
            body : JSON.stringify({
                nama : inputBarang.value,
                harga : parseInt(inputHargaBarang.value),
                satuan : satuanBarang.value,
                jumlah : 0  
            })
        });

        alert("barang logistik berhasil ditambahkan");
        await renderLogistik();
    }
});

async function renderLogistik(){
    const resLogistik = await fetch(`https://lokost-backend-production.up.railway.app/api/logistik`, {
        credentials : 'include'
    });
    const logistik = await resLogistik.json();

    const listLogistik = document.getElementById('list-logistik');
    listLogistik.innerHTML = '';

    logistik.forEach(function(item){
        listLogistik.innerHTML += `<li>
            ${item.nama} - Jumlah: ${item.jumlah} ${item.satuan}
            <button class="btnTambahStok" data-id="${item._id}" data-harga="${item.harga}" data-jumlah="${item.jumlah}" data-nama="${item.nama}">+</button>
            <button class="btnKurangStok" data-id="${item._id}" data-jumlah="${item.jumlah}" data-satuan="${item.satuan}" data-nama="${item.nama}">-</button>
        </li>`
    });

    
    const btnTambahStok = document.querySelectorAll('.btnTambahStok');
    const btnKurangStok = document.querySelectorAll('.btnKurangStok');

    btnTambahStok.forEach(async function(btn){
        btn.addEventListener('click',async function(){
            const index = btn.dataset.id;
            
            const promptJumlah = prompt("Masukan jumlah stok barang");

            if(!promptJumlah || isNaN(parseInt(promptJumlah))){
                return
            }

            if(parseInt(promptJumlah) <= 0){
                alert("Jumlah harus lebih dari 0")
                return;
            }
            
            const nominalHarga = btn.dataset.harga * parseInt(promptJumlah);

            const dataTransaksi = await fetch(`https://lokost-backend-production.up.railway.app/api/transaksi`, {
                method : "POST",
                headers : {
                    'Content-type' : 'application/json',
                },
                credentials : 'include',
                body : JSON.stringify({
                    nama: btn.dataset.nama,
                    nominal: nominalHarga,
                    jenis: 'logistik',
                    tanggal: new Date().toISOString().split('T')[0]
                })
            })

            const resBudget = await fetch(`https://lokost-backend-production.up.railway.app/api/budget`,{
                method : "GET",
                credentials : 'include'
            })

            const budgetData = await resBudget.json();
            const terpakaiSekarang = budgetData[0].terpakai + nominalHarga; 

            await fetch(`https://lokost-backend-production.up.railway.app/api/budget`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials : 'include',
                body: JSON.stringify({ terpakai: terpakaiSekarang })
            })


            const logistik = await fetch(`https://lokost-backend-production.up.railway.app/api/logistik/${index}`,{
                method : "PUT",
                headers : {
                    'Content-type' : 'application/json', 
                },
                credentials : 'include',
               body: JSON.stringify({ jumlah: parseInt(btn.dataset.jumlah) + parseInt(promptJumlah) })
            })

            renderLogistik();
        })


    })
    
    btnKurangStok.forEach(async function(btn){
        btn.addEventListener('click', async function(){
            const index = btn.dataset.id;
            const jumlah = parseInt(btn.dataset.jumlah);
            const satuan = btn.dataset.satuan;
            const nama = btn.dataset.nama;

            if(jumlah === 0){
                alert("Stok barang kosong, tidak bisa dikurangi");
                return;
            }

            const promptJumlah = prompt("Masukan jumlah yang ingin dikurangi");
            if(!promptJumlah || isNaN(parseInt(promptJumlah))){
                return;
            } // ← tambah ini
            if(parseInt(promptJumlah) <= 0){ 
                alert("Jumlah harus lebih dari 0")
                return;
            }
            if (jumlah - parseInt(promptJumlah) >= 0){

                const jumlahBaru = jumlah - parseInt(promptJumlah);

                if(satuan === 'pcs' && jumlahBaru < 3 && jumlahBaru > 0){
                    alert(`Stok ${nama} hampir habis!`);
                }else if(satuan === 'sachet' && jumlahBaru < 4 && jumlahBaru > 0){
                    alert(`Stok ${nama} hampir habis!`);
                }else if(satuan === 'botol' && jumlahBaru < 2 && jumlahBaru > 0){
                    alert(`Stok ${nama} hampir habis!`);
                }else if(satuan === 'bungkus' && jumlahBaru < 5 && jumlahBaru > 0){
                    alert(`Stok ${nama} hampir habis!`);
                }

                await fetch(`https://lokost-backend-production.up.railway.app/api/logistik/${index}`, {
                    method : "PUT",
                    credentials : 'include',
                    body : JSON.stringify({
                        jumlah : jumlahBaru
                    })
                })
                renderLogistik();
            }else{
                alert("Jumlah yang ingin dikurangi melebihi stok yang ada")
            }
        })
    })
}


renderLogistik();