async function checkAuth(){
    const checkLogin = await fetch('/api/user/check', {
        credentials: 'include'
    });
    if(!checkLogin.ok) window.location.href = 'login.html';
}

checkAuth();

const inputNama = document.getElementById('input-nama');
const btnSimpanNama = document.getElementById('btn-simpan-nama');
const btnGantiNama = document.getElementById('btn-ganti-nama');

const namaTersimpan = localStorage.getItem('userName');

if(namaTersimpan){
    inputNama.value = namaTersimpan;
    inputNama.disabled = true;
}else{
    inputNama.disabled = false;
}

btnGantiNama.addEventListener('click', function(){
    inputNama.disabled = false;
    inputNama.focus();  
})

btnSimpanNama.addEventListener('click', function(){
    if(inputNama.value === ''){
        alert('Nama tidak boleh kosong');
    }else{
        localStorage.setItem('userName', inputNama.value);
        inputNama.disabled = true;
        alert('Nama berhasil disimpan');
    }
})

const btnHapusData = document.getElementById('btn-hapus-data');

btnHapusData.addEventListener('click', async function(){
    if(confirm('Anda yakin ingin menghapus semua data?')){
        await fetch(`/api/user/data`,{
            method : 'DELETE',
            credentials : 'include'
        })
        localStorage.clear();
        alert('Semua data berhasil dihapus');
        window.location.href = 'budget.html';
    }
});