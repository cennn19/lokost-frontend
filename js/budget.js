async function checkAuth(){
    const checkLogin = await fetch('/api/user/check', {
        credentials: 'include'
    });
    if(!checkLogin.ok) window.location.href = 'login.html';
}
checkAuth();

const inputBudget = document.getElementById('input-budget');
const btnSimpanBudget = document.getElementById('btn-simpan-budget')

btnSimpanBudget.addEventListener('click', async function() {
    if (inputBudget.value === '') {
        alert("budget belum diinput")
        return;
    }

    if(parseInt(inputBudget.value) <= 0){
        alert("Nominal harus lebih dari 0")
        return;
    }else {
        const saveBudget = await fetch('/api/budget', {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json',
            },
            credentials : 'include',
            body : JSON.stringify({total: parseInt(inputBudget.value), terpakai: 0})
        })
        const sectionCategory = document.getElementById('section-kategori');
        sectionCategory.hidden = false;

        const kategori = [
            { nama: 'Makan', persen: 40 },
            { nama: 'Internet', persen: 20 },
            { nama: 'Kebutuhan Kost', persen: 15 },
            { nama: 'Kendaraan', persen: 15 },
            { nama: 'Lainnya', persen: 10 }
        ];

        const total = parseInt(inputBudget.value);

        kategori.forEach(function(item) {
            item.alokasi = total * item.persen / 100;
        })

        const listKategori = document.getElementById('list-kategori');

        kategori.forEach(function(item, index) {
            listKategori.innerHTML += `<li data-index="${index}">
                ${item.nama}
                <input type="number" value="${item.alokasi}">
            </li>`
        })

        const btnSimpanKategori = document.getElementById('btn-simpan-kategori');

        btnSimpanKategori.addEventListener('click',async function(){
            const allInput = document.querySelectorAll('#list-kategori input');
            const kategoriUpdated = [];

            allInput.forEach(function(input){
                const index = input.parentElement.dataset.index;
                kategoriUpdated.push({
                    nama: kategori[index].nama,
                    nilai: parseInt(input.value)
                })
            })          

            await fetch(`/api/kategori/all`,{
                method : 'DELETE',
                credentials : 'include'
            })

            for(const item of kategoriUpdated){
                await fetch('/api/kategori', {
                    method : 'POST',
                    headers :{
                        'Content-type' : 'application/json',
                    },
                    credentials : 'include',
                    body : JSON.stringify({nama : item.nama, nilai : item.nilai})
                })
            }
            alert("Kategori berhasil disimpan")
        })      
        
    }
})                                                      

const namaTambahBudget = document.getElementById('nama-tambah-budget');
const nominalTambahBudget = document.getElementById('nominal-tambah-budget');
const tanggalTambahBudget = document.getElementById('tanggal-tambah-budget');
const btnTambahBudget = document.getElementById('btn-tambah-budget');

btnTambahBudget.addEventListener('click',async function(){
    if(namaTambahBudget.value === '' || nominalTambahBudget.value === '' || tanggalTambahBudget.value === ''){
        alert("data tambahan budget belum lengkap")
        return;
    }

    if(parseInt(nominalTambahBudget.value) <= 0){
        alert("Nominal harus lebih dari 0")
        return;
    }

    const resBudget = await fetch('/api/budget',{
        method : 'GET',
        credentials : 'include'
    })

    const budgetData = await resBudget.json();
    const totalBudget = budgetData[0].total + parseInt(nominalTambahBudget.value);


    const budgetTotal = await fetch('/api/budget',{
        method : 'PUT',
        headers : {
            'Content-type' : 'application/json',
        },
        credentials : 'include',
        body : JSON.stringify({total: totalBudget})
    })

    const resTransaksi = await fetch('/api/transaksi',{
        method : 'POST',
        headers : {
            'Content-type' : 'application/json',
        },
        credentials : 'include',
        body : JSON.stringify({nama: namaTambahBudget.value, nominal: parseInt(nominalTambahBudget.value), jenis: 'tambahan budget', tanggal: tanggalTambahBudget.value})
    });

    alert("tambahan budget berhasil disimpan")
})