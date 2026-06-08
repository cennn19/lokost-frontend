async function checkAuth(){
    const checkLogin = await fetch('/api/user/check', {
        credentials: 'include'
    });
    if(!checkLogin.ok) window.location.href = 'login.html';
}

checkAuth();

const inputNamaTransaksi = document.getElementById('nama-transaksi');
const inputNominalTransaksi = document.getElementById('nominal-transaksi');
const inputJenisTransaksi = document.getElementById('kategori-transaksi');
const inputTanggalTransaksi = document.getElementById('tanggal-transaksi');
const btnSimpanTransaksi = document.getElementById('btn-simpan-transaksi');

btnSimpanTransaksi.addEventListener('click', async function(){
    if(inputNamaTransaksi.value === '' || inputNominalTransaksi.value === '' || inputJenisTransaksi.value === '' || inputTanggalTransaksi.value === ''){
        alert("data transaksi belum lengkap")
        return;
    }

    if(parseInt(inputNominalTransaksi.value) <= 0){
        alert("Nominal tidak boleh negatif atau nol")
        return;
    }else{
        const nama = inputNamaTransaksi.value;
        const nominal = parseInt(inputNominalTransaksi.value);
        const jenis = inputJenisTransaksi.value;
        const tanggal = inputTanggalTransaksi.value;

       const resBudget = await fetch('/api/budget',{
        method : 'GET',
        credentials : 'include'
       })
       
       const budgetData = await resBudget.json();
       const terpakaiSekarang = budgetData[0].terpakai + nominal;

        const responTransaksi = await fetch('/api/transaksi',{
           method : 'POST',
           headers : {
            'Content-type' : 'application/json',
           },
           credentials : 'include',
           body : JSON.stringify({nama, nominal, jenis, tanggal})
        })

        const responBuget = await fetch('/api/budget',{
            method : 'PUT',
            headers : {
                'Content-type' : 'application/json',
            },
            credentials : 'include',
            body : JSON.stringify({terpakai: terpakaiSekarang})
        })

        alert("transaksi berhasil disimpan")
        renderTransaksi();
    }
})

async function renderTransaksi(){
    const response = await fetch('/api/transaksi',{
        credentials : 'include'
    });

    const transaksi = await response.json();
    
    const listTransaksi = document.getElementById('list-transaksi'); // ← definisi dulu
    listTransaksi.innerHTML = '';                                      

    let simbol = '';
    transaksi.forEach(function(item){
        if(item.jenis === 'tambahan budget') {
            simbol = '(pemasukan)';
        }else {
            simbol = '(pengeluaran)'
        }
        listTransaksi.innerHTML += '<li>'  + item.nama +'  Rp ' + item.nominal.toLocaleString('id-ID') + '  ' + item.tanggal +' '+ simbol + '</li>'
})
}

async function loadKategori(){
    getKategori = await fetch('/api/kategori', {
        method : 'GET',
        credentials : 'include'
    });

    const allCategory = await getKategori.json();
    const selectKategori = document.getElementById('kategori-transaksi');
    
    allCategory.forEach(function(item){
        selectKategori.innerHTML += '<option value="' + item.nama + '">' + item.nama + '</option>'
    });
}
loadKategori();

renderTransaksi();