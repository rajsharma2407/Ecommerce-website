CKEDITOR.replace('content');
    $('.confirmDeletion').on('click',()=>{
            if(!confirm('confirm deletion'))
                return false;   
    })
