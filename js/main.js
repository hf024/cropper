var initCropperInModal = function(img, input){
	var $image = img;
	var $inputImage = input;
	var options = {
		aspectRatio: 1,	
		viewMode: 2,
		guides: false,
		center: false,
		autoCropArea: 1,
		// dragMode: 'move',
		// cropBoxMovable: false,
		// cropBoxResizable: false,
		// autoCropArea: 1,
		// restore: false,
		// minContainerWidth: 100,
		// minContainerHeight: 100,
		// minCanvasWidth: 100,
		// minCanvasHeight: 100,
		toggleDragModeOnDblclick: false,
		preview: '.img-preview'
	};
	
	var saveData = {};
	var URL = window.URL || window.webkitURL;
	var blobURL;
	$inputImage.on('change', function () {
		console.log('change')
		$('#tip-info').hide();
		$image.cropper( $.extend(options, {
			ready: function () {
				// if(saveData.canvasData){
				// 	$image.cropper('setCanvasData', saveData.canvasData);
				// 	$image.cropper('setCropBoxData', saveData.cropBoxData);
				// }
				$('#modal-dialog').addClass('with-preview')
			}
		}));
	})

	$('.btn-close').on('click', function () {
		destoryImage()
	});

	if (URL) {
		$inputImage.change(function() {
			var files = this.files;
			var file;
			if (!$image.data('cropper')) {
				return;
			}
			if (files && files.length) {
				file = files[0];
				if (/^image\/\w+$/.test(file.type)) {

					if(blobURL) {
						URL.revokeObjectURL(blobURL);
					}
					blobURL = URL.createObjectURL(file);

					$image.cropper('reset').cropper('replace', blobURL);

					$('.img-container').removeClass('hidden');
					$('.img-preview-box').removeClass('hidden');
					$('#modal-dialog .disabled').removeAttr('disabled').removeClass('disabled');
					$('#tip-info').hide()
				} else {
					window.alert('请选择一个图像文件！');
				}
			}
		});
	} else {
		$inputImage.prop('disabled', true).addClass('disabled');
	}
}

var zoomBig = function () {
	$('#photo').cropper('zoom', 0.1)
}

var zoomSmall = function () {
	$('#photo').cropper('zoom', -0.1)
}

var rotateZheng = function () {
	$('#photo').cropper('rotate', 90)
}

var rotateNi = function() {
	$('#photo').cropper('rotate', -90)
}
var destoryImage = function () {
	$().cropper('zoom', -0.1)
	$('#modal-dialog').hide()
	$('#tip-info').show();
	$('#modal-dialog').removeClass('with-preview')
	$('.img-container').addClass('hidden');
	$('.img-preview-box').addClass('hidden');
	$('#photo').cropper('destroy')
	$('#btn-submit').addClass('disabled')
	$('#btn-submit').attr('disabled', true)
	$('#photoInput').val('')
}

var sendPhoto = function(){
	$('#photo').cropper('getCroppedCanvas',{
		width: 100,
		height: 100
	}).toBlob(function(blob){
		$('#user-photo').attr('src', URL.createObjectURL(blob));
		destoryImage()
	});

    var photo = $('#photo').cropper('getCroppedCanvas', {
        width: 100,
        height: 100
    }).toDataURL('image/png');

	console.log(photo)
    $.ajax({
        url: '上传地址', // 要上传的地址
        type: 'post',
        data: {
            'imgData': photo
        },
        dataType: 'json',
        success: function (data) {
            if (data.status == 0) {
                // 将上传的头像的地址填入，为保证不载入缓存加个随机数
               //  $('.user-photo').attr('src', '头像地址?t=' + Math.random());
                // $('#changeModal').modal('hide');
            } else {
                alert(data.info);
            }
        }
    });
}

$(function(){
	initCropperInModal($('#photo'),$('#photoInput'));
});