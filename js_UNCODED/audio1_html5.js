/*
 * Audio Player HTML5 v1.6
 *
 * Copyright 2012-2013, LambertGroup
 * 
 */

(function($) {
	
	//vars	
	var val = navigator.userAgent.toLowerCase();
		
	//functions	
	
	function detectBrowserAndAudio(current_obj,options,thumbsHolder_Thumbs,thumbsHolder_Thumb,audio1_html5_sliderVertical,audio1_html5_thumbsHolder,audio1_html5_container) {
				//activate current
				//$(thumbsHolder_Thumbs[current_obj.current_img_no]).addClass('thumbsHolder_ThumbON');
				$(thumbsHolder_Thumbs[current_obj.current_img_no]).css({
					"background":options.playlistRecordBgOnColor,
					"border-bottom-color":options.playlistRecordBottomBorderOnColor,
					"color":options.playlistRecordTextOnColor
				});
				
				//auto scroll carousel if needed
				carouselScroll(-1,current_obj,options,thumbsHolder_Thumb,audio1_html5_sliderVertical,audio1_html5_thumbsHolder);
				
				var currentAudio=current_obj.playlist_arr[current_obj.current_img_no]['sources_mp3'];
				
				//alert (val);
				if (val.indexOf("opera") != -1 || val.indexOf("firefox") != -1  || val.indexOf("mozzila") != -1) 
					currentAudio=current_obj.playlist_arr[current_obj.current_img_no]['sources_ogg'];
					
				if (val.indexOf("chrome") != -1 || val.indexOf("msie") != -1 || val.indexOf("safari") != -1)
					currentAudio=current_obj.playlist_arr[current_obj.current_img_no]['sources_mp3'];
					
				if (val.indexOf("android") != -1)
					currentAudio=current_obj.playlist_arr[current_obj.current_img_no]['sources_mp3'];				
				
				//if (val.match(/(iPad)|(iPhone)|(iPod)|(webOS)/i))
				if (val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1)
					currentAudio=current_obj.playlist_arr[current_obj.current_img_no]['sources_mp3'];

				//alert (currentAudio+ '  --  ' +val);
				return currentAudio;
			};			
	
	function changeSrc(current_obj,options,thumbsHolder_Thumbs,thumbsHolder_Thumb,audio1_html5_sliderVertical,audio1_html5_thumbsHolder,audio1_html5_container,audio1_html5_play_btn,audio1_html5_Audio_seek,audio1_html5_Audio_buffer,audio1_html5_Audio_timer,audio1_html5_AuthorTitle,audio1_html5_AuthorTitleInside,audio1_html5_Audio) {

				current_obj.totalTime = 'Infinity';
				//seekbar init
				if (options.isSliderInitialized) {
					audio1_html5_Audio_seek.slider("destroy");
					options.isSliderInitialized=false;
				}
				if (options.isProgressInitialized) {
					audio1_html5_Audio_buffer.progressbar("destroy");
					options.isProgressInitialized=false;
				}
				//audio1_html5_Audio.unbind('progress');
				current_obj.is_changeSrc=true;
				current_obj.is_buffer_complete=false;
				
				//current_obj.totalTimeInterval='Infinity';
				
				//audio1_html5_AuthorTitle init
				audio1_html5_AuthorTitle.width(current_obj.audioPlayerWidth);
				audio1_html5_Audio_buffer.css({'background':options.bufferEmptyColor});
				
				//.each(function(){ alert ("aaaa"); });
				

				
				current_obj.curSongText='';
				if (options.showAuthor && current_obj.playlist_arr[current_obj.current_img_no]['author']!=null && current_obj.playlist_arr[current_obj.current_img_no]['author']!='') {
	            	current_obj.curSongText+=current_obj.playlist_arr[current_obj.current_img_no]['author']+' - ';
				}				       
				if (options.showTitle && current_obj.playlist_arr[current_obj.current_img_no]['title']!=null && current_obj.playlist_arr[current_obj.current_img_no]['title']!='') {
	            	current_obj.curSongText+=current_obj.playlist_arr[current_obj.current_img_no]['title'];
	            }
				current_obj.isAuthorTitleInsideScrolling=false;
				current_obj.authorTitleInsideWait=0;
				audio1_html5_AuthorTitleInside.stop();
				audio1_html5_AuthorTitleInside.css({'margin-left':0});	
				audio1_html5_AuthorTitleInside.html(current_obj.curSongText);
					
				if (!current_obj.curSongText) {
					audio1_html5_AuthorTitle.css({
						'display':'none',
						'width':0,
						'height':0,
						'padding':0,
						'margin':0
					});
				}
					
				
				//audio1_html5_Audio.type='audio/ogg; codecs="vorbis"';
				document.getElementById(current_obj.audioID).src=detectBrowserAndAudio(current_obj,options,thumbsHolder_Thumbs,thumbsHolder_Thumb,audio1_html5_sliderVertical,audio1_html5_thumbsHolder,audio1_html5_container);
				document.getElementById(current_obj.audioID).load();
				
				//alert (audio1_html5_Audio.type );
				
				
				if (val.indexOf("android") != -1) {
					//nothing
				} else if ((val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1) && current_obj.is_very_first) {
					//nothing
				} else {
					if (options.autoPlay) {
						cancelAll();
						document.getElementById(current_obj.audioID).play();
						//audio1_html5_play_btn.click();
						audio1_html5_play_btn.addClass('AudioPause');
					} else {
						audio1_html5_play_btn.removeClass('AudioPause');
					}
				}

			};
			
			


			function FormatTime(seconds){
				var m=Math.floor(seconds/60)<10?"0"+Math.floor(seconds/60):Math.floor(seconds/60);
				var s=Math.floor(seconds-(m*60))<10?"0"+Math.floor(seconds-(m*60)):Math.floor(seconds-(m*60));
				return m+":"+s;
			};

        



			function generate_seekBar(current_obj,options,audio1_html5_container,audio1_html5_Audio_seek,audio1_html5_Audio_buffer,audio1_html5_Audio_timer,audio1_html5_play_btn,audio1_html5_Audio) {
				//alert ("gen: "+document.getElementById(current_obj.audioID).readyState);
					current_obj.is_changeSrc=false;
					if (current_obj.is_very_first)
						current_obj.is_very_first=false;
					//initialize the seebar
					//alert (current_obj.audioPlayerWidth);
					audio1_html5_Audio_buffer.width(current_obj.audioPlayerWidth);
					audio1_html5_Audio_seek.width(current_obj.audioPlayerWidth);
					
					audio1_html5_Audio_seek.slider({
						value: 0,
						step: 0.01,
						orientation: "horizontal",
						range: "min",
						max: current_obj.totalTime,
						//animate: true,					
						slide: function(){							
							current_obj.is_seeking = true;
						},
						stop:function(e,ui){
							current_obj.is_seeking = false;						
							document.getElementById(current_obj.audioID).currentTime=ui.value;
							if(document.getElementById(current_obj.audioID).paused != false) {
								document.getElementById(current_obj.audioID).play();
								audio1_html5_play_btn.addClass('AudioPause');				
							}
							
						},
						create: function( e, ui ) {
							options.isSliderInitialized=true;
						}
					});
					$(".ui-slider-range",audio1_html5_Audio_seek).css({'background':options.seekbarColor});
					
					
					
					var bufferedTime=0;
					audio1_html5_Audio_buffer.progressbar({ 
						value: bufferedTime,
						complete: function(){							
							current_obj.is_buffer_complete=true;
						},
						create: function( e, ui ) {
							options.isProgressInitialized=true;
						}
					});
					$(".ui-widget-header",audio1_html5_Audio_buffer).css({'background':options.bufferFullColor});
			

				
			};

			
		
			
			function seekUpdate(current_obj,options,audio1_html5_container,audio1_html5_Audio_seek,audio1_html5_Audio_buffer,audio1_html5_Audio_timer,audio1_html5_play_btn,audio1_html5_Audio,audio1_html5_AuthorTitle,audio1_html5_AuthorTitleInside) {
				if (!current_obj.isAuthorTitleInsideScrolling && current_obj.authorTitleInsideWait>=5 && audio1_html5_AuthorTitleInside.width()>current_obj.audioPlayerWidth) {
					current_obj.isAuthorTitleInsideScrolling=true;
					current_obj.authorTitleInsideWait=0;
					audio1_html5_AuthorTitleInside.html(current_obj.curSongText+" **** "+current_obj.curSongText+" **** "+current_obj.curSongText+" **** "+current_obj.curSongText+" **** "+current_obj.curSongText+" **** ");
					audio1_html5_AuthorTitleInside.css({'margin-left':0});					
					audio1_html5_AuthorTitleInside.stop().animate({
							'margin-left':(current_obj.audioPlayerWidth-audio1_html5_AuthorTitleInside.width())+'px'
					 }, parseInt((audio1_html5_AuthorTitleInside.width()-current_obj.audioPlayerWidth)*10000/150,10), 'linear', function() {
							// Animation complete.
							  current_obj.isAuthorTitleInsideScrolling=false;
					});
				} else if (!current_obj.isAuthorTitleInsideScrolling && audio1_html5_AuthorTitleInside.width()>current_obj.audioPlayerWidth) {
					current_obj.authorTitleInsideWait++;
				}
				
				//update time
				curTime = document.getElementById(current_obj.audioID).currentTime;
				bufferedTime=0;
				if (current_obj.is_changeSrc && !isNaN(current_obj.totalTime) && current_obj.totalTime!='Infinity') {
					//alert (current_obj.totalTime);
					generate_seekBar(current_obj,options,audio1_html5_container,audio1_html5_Audio_seek,audio1_html5_Audio_buffer,audio1_html5_Audio_timer,audio1_html5_play_btn,audio1_html5_Audio);
					if (val.indexOf("android") != -1) {
						if (options.autoPlay) {
							document.getElementById(current_obj.audioID).play();
							//audio1_html5_play_btn.click();
							audio1_html5_play_btn.addClass('AudioPause');
						} else {
							audio1_html5_play_btn.removeClass('AudioPause');
						}
					}
				}
					
						
						//update seekbar
						if(!current_obj.is_seeking && options.isSliderInitialized)
							audio1_html5_Audio_seek.slider('value', curTime);
						
						//the buffer	
						if (val.indexOf("android") != -1) {
							audio1_html5_Audio_buffer.css({'background':options.bufferFullColor});
							if (!isNaN(current_obj.totalTime) && current_obj.totalTime!='Infinity')
								audio1_html5_Audio_timer.text(FormatTime(curTime)+' / '+FormatTime(current_obj.totalTime));
							else
								audio1_html5_Audio_timer.text('00:00 / '+FormatTime(0));	
						} else {
								if (document.getElementById(current_obj.audioID).buffered.length) {
									bufferedTime = document.getElementById(current_obj.audioID).buffered.end(document.getElementById(current_obj.audioID).buffered.length-1); 
									//alert (current_obj.totalTime + ' > '+bufferedTime);
									if (bufferedTime>0 && !current_obj.is_buffer_complete && !isNaN(current_obj.totalTime) && current_obj.totalTime!='Infinity' && options.isProgressInitialized) {
										audio1_html5_Audio_buffer.progressbar({ value: bufferedTime*100/current_obj.totalTime });
										//alert (bufferedTime+' -- '+current_obj.audioPlayerWidth);
									}
								}
								audio1_html5_Audio_timer.text(FormatTime(curTime)+' / '+FormatTime(bufferedTime));
						} 
				/*} else {
					audio1_html5_Audio_timer.text('00:00 / '+FormatTime(0));
				}*/
				
					
					
			};
			
			
			function endAudioHandler(current_obj,options,audio1_html5_container,audio1_html5_play_btn,audio1_html5_Audio_seek,audio1_html5_Audio_buffer,audio1_html5_Audio_timer,audio1_html5_AuthorTitle,audio1_html5_AuthorTitleInside,audio1_html5_next_btn,audio1_html5_Audio) {
		        if (options.loop) {
					audio1_html5_next_btn.click();
		        }
		    }		
			
			
		//playlist scroll
		function carouselScroll(direction,current_obj,options,thumbsHolder_Thumb,audio1_html5_sliderVertical,audio1_html5_thumbsHolder) {
				var MAX_TOP=(thumbsHolder_Thumb.height()+1)*(current_obj.total_images-options.numberOfThumbsPerScreen);
				//alert (audio1_html5_sliderVertical.slider( "option", "animate" ));
				audio1_html5_thumbsHolder.stop(true,true);
				if (direction!=-1 && !current_obj.isCarouselScrolling) {
					current_obj.isCarouselScrolling=true;
					audio1_html5_thumbsHolder.animate({
					    //opacity: 1,
					    //top:parseInt(MAX_TOP*(direction-100)/100,10)+'px'
						top:((direction<=2)?(-1)*MAX_TOP:parseInt(MAX_TOP*(direction-100)/100,10))+'px'
					  }, 1100, 'easeOutQuad', function() {
					    // Animation complete.
						  current_obj.isCarouselScrolling=false;
					});
				} else if (!current_obj.isCarouselScrolling && current_obj.total_images>options.numberOfThumbsPerScreen) {
					current_obj.isCarouselScrolling=true;
					//audio1_html5_thumbsHolder.css('opacity','0.5');			
					var new_top=(-1)*parseInt((thumbsHolder_Thumb.height()+1)*current_obj.current_img_no,10);
					if( Math.abs(new_top) > MAX_TOP ){ new_top = (-1)*MAX_TOP; }		
					if (current_obj.total_images>options.numberOfThumbsPerScreen && options.showPlaylist) {			
						audio1_html5_sliderVertical.slider( "value" , 100 + parseInt( new_top * 100 / MAX_TOP ) );
					}
					audio1_html5_thumbsHolder.animate({
					    //opacity: 1,
					    top:new_top+'px'
					  }, 500, 'easeOutCubic', function() {
					    // Animation complete.
						  current_obj.isCarouselScrolling=false;
					});
				}
			};





			function getInternetExplorerVersion()
			// -1 - not IE
			// 7,8,9 etc
			{
			   var rv = -1; // Return value assumes failure.
			   if (navigator.appName == 'Microsoft Internet Explorer')
			   {
				  var ua = navigator.userAgent;
				  var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
				  if (re.exec(ua) != null)
					 rv = parseFloat( RegExp.$1 );
			   }
			   return parseInt(rv,10);
			}

			function cancelAll() {
				//alert ($("audio").attr('id'));
				//$("audio")[0].pause();				
				$("audio").each(function() {
					$('.AudioPlay').removeClass('AudioPause');
					$(this)[0].pause();
				});				
			}

		
		
	//core
	$.fn.audio1_html5 = function(options) {
		
		var options = $.extend({},$.fn.audio1_html5.defaults, options);
		//parse it
		return this.each(function() {
			var audio1_html5_Audio = $(this);
		
			
			//the controllers
			var audio1_html5_controlsDef = $('<div class="AudioControls"> <a class="AudioRewind" title="Rewind"></a><a class="AudioPlay" title="Play/Pause"></a><a class="AudioPrev" title="Previous"></a><a class="AudioNext" title="Next"></a><a class="AudioShowHidePlaylist" title="Show/Hide Playlist"></a><a class="VolumeButton" title="Mute/Unmute"></a><div class="VolumeSlider"></div> <div class="AudioTimer">00:00 / 00:00</div>  </div>   <div class="AudioBuffer"></div><div class="AudioSeek"></div><div class="songAuthorTitle"><div class="songAuthorTitleInside">AA</div></div>    <div class="thumbsHolderWrapper"><div class="playlistPadding"><div class="thumbsHolderVisibleWrapper"><div class="thumbsHolder"></div></div></div></div>  <div class="slider-vertical"></div>');						
		
					
			
			//the elements
			var audio1_html5_container = audio1_html5_Audio.parent('.audio1_html5');
			var audio1_html5_border = $(this).parent();

			audio1_html5_container.addClass(options.skin);
			audio1_html5_container.append(audio1_html5_controlsDef);					
			
			var audio1_html5_controls = $('.AudioControls', audio1_html5_container);
			var audio1_html5_rewind_btn = $('.AudioRewind', audio1_html5_container);
			var audio1_html5_play_btn = $('.AudioPlay', audio1_html5_container);
			var audio1_html5_prev_btn = $('.AudioPrev', audio1_html5_container);
			var audio1_html5_next_btn = $('.AudioNext', audio1_html5_container);			
			var audio1_html5_showHidePlaylist_btn = $('.AudioShowHidePlaylist', audio1_html5_container);
			var audio1_html5_volumeMute_btn = $('.VolumeButton', audio1_html5_container);
			var audio1_html5_volumeSlider = $('.VolumeSlider', audio1_html5_container);
			var audio1_html5_Audio_timer = $('.AudioTimer', audio1_html5_container);
			var audio1_html5_AuthorTitle = $('.songAuthorTitle', audio1_html5_container);
			var audio1_html5_AuthorTitleInside = $('.songAuthorTitleInside', audio1_html5_container);
			
			
			var audio1_html5_Audio_buffer = $('.AudioBuffer', audio1_html5_container);
			var audio1_html5_Audio_seek = $('.AudioSeek', audio1_html5_container);
			
			var ver_ie=getInternetExplorerVersion();
			
			
			

			
			//initilize the player with the options
			audio1_html5_container.css({
				'background':options.playerBg,
				'padding':options.playerPadding+'px'
			});
			
			
			if (val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1) {
				//audio1_html5_controls.css({margin-top:-20px;});
				audio1_html5_container.css({
					'padding-top':'0px'
				});
			}
			
			var current_obj = {
				current_img_no:0,
				is_very_first:true,
				total_images:0,
				is_seeking:false,
				is_changeSrc:false,
				is_buffer_complete:false,
				timeupdateInterval:'',
				totalTime:'',
				playlist_arr:'',
				isCarouselScrolling:false,
				isAuthorTitleInsideScrolling:false,
				curSongText:'',
				authorTitleInsideWait:0,
				audioPlayerWidth:0,
				audioPlayerHeight:0,
				audioID:'',
				audioObj:''
			};
			current_obj.audioID=audio1_html5_Audio.attr('id');			
			
			
			current_obj.audioPlayerWidth=0;
			if (!options.showRewindBut) {				
				audio1_html5_rewind_btn.css({
					'display':'none',
					'width':0,
					'height':0,
					'padding':0,
					'margin':0
				});
			} else {
				current_obj.audioPlayerWidth+=audio1_html5_rewind_btn.width() + parseInt(audio1_html5_rewind_btn.css('margin-left').substring(0, audio1_html5_rewind_btn.css('margin-left').length-2)) + parseInt(audio1_html5_rewind_btn.css('margin-right').substring(0, audio1_html5_rewind_btn.css('margin-right').length-2));
			}
				
			if (!options.showPlayBut) {
				audio1_html5_play_btn.css({					
					'display':'none',
					'width':0,
					'height':0,
					'padding':0,
					'margin':0
				});
			} else {
				current_obj.audioPlayerWidth+=audio1_html5_play_btn.width() + parseInt(audio1_html5_play_btn.css('margin-left').substring(0, audio1_html5_play_btn.css('margin-left').length-2)) + parseInt(audio1_html5_play_btn.css('margin-right').substring(0, audio1_html5_play_btn.css('margin-right').length-2));
			}
				
			if (!options.showPreviousBut) {
				audio1_html5_prev_btn.css({
					'display':'none',
					'width':0,
					'height':0,
					'padding':0,
					'margin':0
				});
			} else {
				current_obj.audioPlayerWidth+=audio1_html5_prev_btn.width() + parseInt(audio1_html5_prev_btn.css('margin-left').substring(0, audio1_html5_prev_btn.css('margin-left').length-2)) + parseInt(audio1_html5_prev_btn.css('margin-right').substring(0, audio1_html5_prev_btn.css('margin-right').length-2));
			}
				
			if (!options.showNextBut) {
				audio1_html5_next_btn.css({
					'display':'none',
					'width':0,
					'height':0,
					'padding':0,
					'margin':0
				});
			} else {
				current_obj.audioPlayerWidth+=audio1_html5_next_btn.width() + parseInt(audio1_html5_next_btn.css('margin-left').substring(0, audio1_html5_next_btn.css('margin-left').length-2)) + parseInt(audio1_html5_next_btn.css('margin-right').substring(0, audio1_html5_next_btn.css('margin-right').length-2));
			}
				
			if (!options.showPlaylistBut) {
				audio1_html5_showHidePlaylist_btn.css({
					'display':'none',
					'width':0,
					'height':0,
					'padding':0,
					'margin':0
				});
			} else {
				current_obj.audioPlayerWidth+=audio1_html5_showHidePlaylist_btn.width() + parseInt(audio1_html5_showHidePlaylist_btn.css('margin-left').substring(0, audio1_html5_showHidePlaylist_btn.css('margin-left').length-2)) + parseInt(audio1_html5_showHidePlaylist_btn.css('margin-right').substring(0, audio1_html5_showHidePlaylist_btn.css('margin-right').length-2));
			}
				
			if (!options.showVolumeBut) {
				audio1_html5_volumeMute_btn.css({
					'display':'none',
					'width':0,
					'height':0,
					'padding':0,
					'margin':0
				});
			} else {
				current_obj.audioPlayerWidth+=audio1_html5_volumeMute_btn.width() + parseInt(audio1_html5_volumeMute_btn.css('margin-left').substring(0, audio1_html5_volumeMute_btn.css('margin-left').length-2)) + parseInt(audio1_html5_volumeMute_btn.css('margin-right').substring(0, audio1_html5_volumeMute_btn.css('margin-right').length-2));
			}
				
			if (!options.showVolumeSliderBut) {
				audio1_html5_volumeSlider.css({
					'display':'none',
					'width':0,
					'height':0,
					'padding':0,
					'margin':0
				});
			} else {
				current_obj.audioPlayerWidth+=audio1_html5_volumeSlider.width() + parseInt(audio1_html5_volumeSlider.css('margin-left').substring(0, audio1_html5_volumeSlider.css('margin-left').length-2)) + parseInt(audio1_html5_volumeSlider.css('margin-right').substring(0, audio1_html5_volumeSlider.css('margin-right').length-2));
			}
				
			if (!options.showTimer) {				
				audio1_html5_Audio_timer.css({
					'display':'none',
					'width':0,
					'height':0,
					'padding':0,
					'margin':0
				});
			} else {
				current_obj.audioPlayerWidth+=audio1_html5_Audio_timer.width() + parseInt(audio1_html5_Audio_timer.css('margin-left').substring(0, audio1_html5_Audio_timer.css('margin-left').length-2)) + parseInt(audio1_html5_Audio_timer.css('margin-right').substring(0, audio1_html5_Audio_timer.css('margin-right').length-2));
			}
				
			if (!options.showSeekBar) {
				audio1_html5_Audio_buffer.css({
					'display':'none',
					'width':0,
					'height':0,
					'padding':0,
					'margin':0
				});
				audio1_html5_Audio_seek.css({
					'display':'none',
					'width':0,
					'height':0,
					'padding':0,
					'margin':0
				});
			}
			
			
			audio1_html5_Audio_timer.css({'color':options.timerColor});
			audio1_html5_AuthorTitle.css({'color':options.songAuthorTitleColor});
			
				


			//current_obj.audioPlayerWidth=audio1_html5_container.width()-10;
			//current_obj.audioPlayerWidth=audio1_html5_container.width()-10-widthAdjust;	
			if (ver_ie!=-1 || val.indexOf("android") != -1 || val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1) {
					current_obj.audioPlayerWidth-=9;
			} else {
					current_obj.audioPlayerWidth-=9;	
			}
			
			//options.playlistTopPos=0;
			if (val.indexOf("android") != -1) {
				options.playlistTopPos-=0;
			} else if (val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1) {
				audio1_html5_controls.css('margin-top','-9px');
				options.playlistTopPos-=5;
			}
			/*if (!options.showAuthor && !options.showTitle) {
				options.playlistTopPos-=0;
			}		
			if (options.showSeekBar && !options.showAuthor && !options.showTitle) {
				options.playlistTopPos-=0;
			}*/
						
			audio1_html5_border.width(current_obj.audioPlayerWidth+10);			
			
			if (!options.showSeekBar) {
				/*if (val.indexOf("android") != -1) {
					audio1_html5_border.height(audio1_html5_container.height()-24);
				} else if (val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1) {
					audio1_html5_border.height(audio1_html5_container.height()-18);
				} else if (ver_ie!=-1) {
					audio1_html5_border.height(audio1_html5_container.height()-24);
				} else if (val.indexOf("opera") != -1) {
					audio1_html5_border.height(audio1_html5_container.height()-24);
				} else {
					audio1_html5_border.height(audio1_html5_container.height()-4);
				}*/
				audio1_html5_border.height(audio1_html5_container.height()-4);
			}
			
			if (!options.showAuthor && !options.showTitle) {
				audio1_html5_border.height(audio1_html5_container.height()-22);
			}
			
		
		
			current_obj.audioPlayerHeight=audio1_html5_container.height()+2*options.playerPadding;
			
		
			
			
			//generate playlist
			var currentCarouselTop=0;
			var audio1_html5_thumbsHolderWrapper = $('.thumbsHolderWrapper', audio1_html5_container);
			var audio1_html5_playlistPadding = $('.playlistPadding', audio1_html5_container);
			var audio1_html5_thumbsHolderVisibleWrapper = $('.thumbsHolderVisibleWrapper', audio1_html5_container);
			var audio1_html5_thumbsHolder = $('.thumbsHolder', audio1_html5_container);
			var audio1_html5_sliderVertical = $('.slider-vertical', audio1_html5_container);
			
			if (!options.showPlaylist) {
				audio1_html5_thumbsHolderWrapper.css({'display':'none'});
			}			
			
			if (!options.showPlaylistOnInit) {
				audio1_html5_thumbsHolderWrapper.css({
					    'opacity': 0,
						'margin-top':'-20px',
						'display':'none'
				});
			}			

			audio1_html5_thumbsHolderWrapper.css({
				'width':audio1_html5_container.width()+2*options.playerPadding+'px',
				'top':current_obj.audioPlayerHeight+options.playlistTopPos+'px',
				'left':'0px',
				'background':options.playlistBgColor
				
			});
			
			audio1_html5_thumbsHolderVisibleWrapper.width(audio1_html5_container.width()+1+2*options.playerPadding);

			
			current_obj.playlist_arr=new Array();
			
			var playlistElements = $('.xaudioplaylist', audio1_html5_container).children();
			playlistElements.each(function() { // ul-s
	            currentElement = $(this);
	            current_obj.total_images++;
	            current_obj.playlist_arr[current_obj.total_images-1]=new Array();
	            current_obj.playlist_arr[current_obj.total_images-1]['title']='';
	            current_obj.playlist_arr[current_obj.total_images-1]['author']='';
	            current_obj.playlist_arr[current_obj.total_images-1]['thumb']='';
	            current_obj.playlist_arr[current_obj.total_images-1]['sources_mp3']='';
	            current_obj.playlist_arr[current_obj.total_images-1]['sources_ogg']='';
	            
	            //alert (currentElement.find('.xtitle').html())
	            if (currentElement.find('.xtitle').html()!=null) {
	            	current_obj.playlist_arr[current_obj.total_images-1]['title']=currentElement.find('.xtitle').html();
	            }	            
	            
	            if (currentElement.find('.xauthor').html()!=null) {
	            	current_obj.playlist_arr[current_obj.total_images-1]['author']=currentElement.find('.xauthor').html();
	            }
	            
	            if (currentElement.find('.xthumb').html()!=null) {
	            	current_obj.playlist_arr[current_obj.total_images-1]['thumb']=currentElement.find('.xthumb').html();
	            }

	            if (currentElement.find('.xsources_mp3').html()!=null) {
	            	current_obj.playlist_arr[current_obj.total_images-1]['sources_mp3']=currentElement.find('.xsources_mp3').html();
	            }	  
	            
	            if (currentElement.find('.xsources_ogg').html()!=null) {
	            	current_obj.playlist_arr[current_obj.total_images-1]['sources_ogg']=currentElement.find('.xsources_ogg').html();
	            }
					
	            
				thumbsHolder_Thumb = $('<div class="thumbsHolder_ThumbOFF" rel="'+ (current_obj.total_images-1) +'"><div class="padding">'+((options.showPlaylistNumber)?current_obj.total_images+'. ':'')+current_obj.playlist_arr[current_obj.total_images-1]['title']+'</div></div>');
	            audio1_html5_thumbsHolder.append(thumbsHolder_Thumb);
				

            	thumbsHolder_Thumb.css({
					"top":(thumbsHolder_Thumb.height()+1)*current_obj.total_images+'px',
					"background":options.playlistRecordBgOffColor,
					"border-bottom-color":options.playlistRecordBottomBorderOffColor,
					"color":options.playlistRecordTextOffColor
				});				
	            
	            //activate first
	            if (current_obj.total_images===1) {
	            	//thumbsHolder_Thumb.addClass('thumbsHolder_ThumbON');
					thumbsHolder_Thumb.css({
						"background":options.playlistRecordBgOnColor,
						"border-bottom-color":options.playlistRecordBottomBorderOnColor,
						"color":options.playlistRecordTextOnColor
					});
				}
           
	            
			});		
			
			audio1_html5_thumbsHolderWrapper.height(2*options.playlistPadding+(thumbsHolder_Thumb.height()+1)*((options.numberOfThumbsPerScreen<current_obj.total_images)?options.numberOfThumbsPerScreen:current_obj.total_images)); //thumbsHolder_Thumb.height()+1 - 1 is the border
	        audio1_html5_thumbsHolderVisibleWrapper.height((thumbsHolder_Thumb.height()+1)*((options.numberOfThumbsPerScreen<current_obj.total_images)?options.numberOfThumbsPerScreen:current_obj.total_images));	
			audio1_html5_playlistPadding.css({'padding':options.playlistPadding+'px'});
			
            
			//the playlist scroller
			if (current_obj.total_images>options.numberOfThumbsPerScreen && options.showPlaylist) {
				audio1_html5_sliderVertical.slider({
					orientation: "vertical",
					range: "min",
					min: 1,
					max: 100,
					step:1,
					value: 100,
					slide: function( event, ui ) {
						//alert( ui.value );
						carouselScroll(ui.value,current_obj,options,thumbsHolder_Thumb,audio1_html5_sliderVertical,audio1_html5_thumbsHolder);
					}
				});
				audio1_html5_sliderVertical.css({
					'display':'inline',
					'position':'absolute',
					'height':audio1_html5_thumbsHolderWrapper.height()-16-2*options.playlistPadding+'px', // 16 is the height of  .slider-vertical.ui-slider .ui-slider-handle
					'left':audio1_html5_container.width()+2*options.playerPadding-audio1_html5_sliderVertical.width()-options.playlistPadding+'px',
					'top':current_obj.audioPlayerHeight+options.playlistTopPos+options.playlistPadding+'px'
				});
				
				if (!options.showPlaylistOnInit)
					audio1_html5_sliderVertical.css({
						'opacity': 0,
						'display':'none'
					});
					
				$('.thumbsHolder_ThumbOFF', audio1_html5_container).css({
					'width':audio1_html5_container.width()+2*options.playerPadding-audio1_html5_sliderVertical.width()-3*options.playlistPadding+'px'
				});						

            } else {
				$('.thumbsHolder_ThumbOFF', audio1_html5_container).css({
					'width':audio1_html5_container.width()+2*options.playerPadding-2*options.playlistPadding+'px'
				});					
			}
			
		

//alert (audio1_html5_container.css("top"));
			
			
			
			
			// mouse wheel
			audio1_html5_thumbsHolderVisibleWrapper.mousewheel(function(event, delta, deltaX, deltaY) {
				event.preventDefault();
				var currentScrollVal=audio1_html5_sliderVertical.slider( "value");
				//alert (currentScrollVal+' -- '+delta);
				if ( (parseInt(currentScrollVal)>1 && parseInt(delta)==-1) || (parseInt(currentScrollVal)<100 && parseInt(delta)==1) ) {
					currentScrollVal = currentScrollVal + delta;
					audio1_html5_sliderVertical.slider( "value", currentScrollVal);
					carouselScroll(currentScrollVal,current_obj,options,thumbsHolder_Thumb,audio1_html5_sliderVertical,audio1_html5_thumbsHolder)
					//alert (currentScrollVal);
				}
				
			});	
			
			//tumbs nav
			var thumbsHolder_Thumbs=$('.thumbsHolder_ThumbOFF', audio1_html5_container);
			thumbsHolder_Thumbs.css({
				"background":options.playlistRecordBgOffColor,
				"border-bottom-color":options.playlistRecordBottomBorderOffColor,
				"color":options.playlistRecordTextOffColor
			});

			thumbsHolder_Thumbs.click(function() {
				if (!current_obj.is_changeSrc) {	
					options.autoPlay=true;
					var currentBut=$(this);
					var i=currentBut.attr('rel');

					thumbsHolder_Thumbs.css({
						"background":options.playlistRecordBgOffColor,
						"border-bottom-color":options.playlistRecordBottomBorderOffColor,
						"color":options.playlistRecordTextOffColor
					});
					
					current_obj.current_img_no=i;
					changeSrc(current_obj,options,thumbsHolder_Thumbs,thumbsHolder_Thumb,audio1_html5_sliderVertical,audio1_html5_thumbsHolder,audio1_html5_container,audio1_html5_play_btn,audio1_html5_Audio_seek,audio1_html5_Audio_buffer,audio1_html5_Audio_timer,audio1_html5_AuthorTitle,audio1_html5_AuthorTitleInside,audio1_html5_Audio);
				}
			});	
			
			
			thumbsHolder_Thumbs.mouseover(function() {
				var currentBut=$(this);
				currentBut.css({
					"background":options.playlistRecordBgOnColor,
					"border-bottom-color":options.playlistRecordBottomBorderOnColor,
					"color":options.playlistRecordTextOnColor
				});				
			});
			
			
			thumbsHolder_Thumbs.mouseout(function() {
				var currentBut=$(this);
				var i=currentBut.attr('rel');
				if (current_obj.current_img_no!=i){
					currentBut.css({
						"background":options.playlistRecordBgOffColor,
						"border-bottom-color":options.playlistRecordBottomBorderOffColor,
						"color":options.playlistRecordTextOffColor
					});
				}
			});			
			
			
			
			
			
			
			
			
			
			//start initialize volume slider
			audio1_html5_volumeSlider.slider({
				value: options.initialVolume,
				step: 0.05,
				orientation: "horizontal",
				range: "min",
				max: 1,
				animate: true,					
				slide:function(e,ui){
						//document.getElementById(current_obj.audioID).muted=false;
						document.getElementById(current_obj.audioID).volume=ui.value;
				},
				stop:function(e,ui){
					
				}
			});
			document.getElementById(current_obj.audioID).volume=options.initialVolume;
			audio1_html5_volumeSlider.css({'background':options.volumeOffColor});
			$(".ui-slider-range",audio1_html5_volumeSlider).css({'background':options.volumeOnColor});
			//end initialize volume slider			
			
			
			
			//buttons start
			audio1_html5_play_btn.click(function() {
				var is_paused=document.getElementById(current_obj.audioID).paused;
				cancelAll();
				if (is_paused == false) {
					document.getElementById(current_obj.audioID).pause();
					audio1_html5_play_btn.removeClass('AudioPause');
				} else {	
					document.getElementById(current_obj.audioID).play();
					audio1_html5_play_btn.addClass('AudioPause');
				}
			});
			
			audio1_html5_rewind_btn.click(function() {
				document.getElementById(current_obj.audioID).currentTime=0;
				cancelAll();
				document.getElementById(current_obj.audioID).play();
				audio1_html5_play_btn.addClass('AudioPause');
				//alert (document.getElementById(current_obj.audioID).playing);
			});
			
			audio1_html5_next_btn.click(function() {
				if (!current_obj.is_changeSrc || current_obj.is_very_first) {
					options.autoPlay=true;
					//$(thumbsHolder_Thumbs[current_obj.current_img_no]).removeClass('thumbsHolder_ThumbON');
					thumbsHolder_Thumbs.css({
						"background":options.playlistRecordBgOffColor,
						"border-bottom-color":options.playlistRecordBottomBorderOffColor,
						"color":options.playlistRecordTextOffColor
					});

					
					if (current_obj.current_img_no==current_obj.total_images-1)
						current_obj.current_img_no=0;
					else
						current_obj.current_img_no++;	
							        	
					changeSrc(current_obj,options,thumbsHolder_Thumbs,thumbsHolder_Thumb,audio1_html5_sliderVertical,audio1_html5_thumbsHolder,audio1_html5_container,audio1_html5_play_btn,audio1_html5_Audio_seek,audio1_html5_Audio_buffer,audio1_html5_Audio_timer,audio1_html5_AuthorTitle,audio1_html5_AuthorTitleInside,audio1_html5_Audio);
				}
			});
			
			audio1_html5_prev_btn.click(function() {
				if (!current_obj.is_changeSrc || current_obj.is_very_first) {	
					options.autoPlay=true;
					//$(thumbsHolder_Thumbs[current_obj.current_img_no]).removeClass('thumbsHolder_ThumbON');
					thumbsHolder_Thumbs.css({
						"background":options.playlistRecordBgOffColor,
						"border-bottom-color":options.playlistRecordBottomBorderOffColor,
						"color":options.playlistRecordTextOffColor
					});

					
					if (current_obj.current_img_no-1<0)
						current_obj.current_img_no=current_obj.total_images-1;
					else
						current_obj.current_img_no--;

					changeSrc(current_obj,options,thumbsHolder_Thumbs,thumbsHolder_Thumb,audio1_html5_sliderVertical,audio1_html5_thumbsHolder,audio1_html5_container,audio1_html5_play_btn,audio1_html5_Audio_seek,audio1_html5_Audio_buffer,audio1_html5_Audio_timer,audio1_html5_AuthorTitle,audio1_html5_AuthorTitleInside,audio1_html5_Audio);
				}				
			});			
				

			audio1_html5_showHidePlaylist_btn.click(function() {

				if (audio1_html5_thumbsHolderWrapper.css('margin-top').substring(0, audio1_html5_thumbsHolderWrapper.css('margin-top').length-2) < 0) {
					aux_opacity=1;
					aux_display='block';
					aux_margin_top="0px";
					audio1_html5_thumbsHolderWrapper.css({
						'display':aux_display
					});
					if (current_obj.total_images>options.numberOfThumbsPerScreen)
						audio1_html5_sliderVertical.css({
							'opacity': 1,
							'display':'block'
						});
				} else {
					aux_opacity=0;
					aux_display='none';
					aux_margin_top="-20px";
					if (current_obj.total_images>options.numberOfThumbsPerScreen)
						audio1_html5_sliderVertical.css({
							'opacity': 0,
							'display':'none'
						});
				}
				
				audio1_html5_thumbsHolderWrapper.animate({
					    'opacity': aux_opacity,
						'margin-top':aux_margin_top

					  }, 500, 'easeOutQuad', function() {
					    // Animation complete.
						audio1_html5_thumbsHolderWrapper.css({
							'display':aux_display
						});
					});				
			});
			
			audio1_html5_volumeMute_btn.click(function() {
				if (!document.getElementById(current_obj.audioID).muted) {
					document.getElementById(current_obj.audioID).muted=true;
					audio1_html5_volumeMute_btn.addClass('VolumeButtonMuted');
				} else {
					document.getElementById(current_obj.audioID).muted=false;
					audio1_html5_volumeMute_btn.removeClass('VolumeButtonMuted');
				}
			});
			//buttons end
			
			
			
			//audio ended
			document.getElementById(current_obj.audioID).addEventListener('ended',function (){endAudioHandler(current_obj,options,audio1_html5_container,audio1_html5_play_btn,audio1_html5_Audio_seek,audio1_html5_Audio_buffer,audio1_html5_Audio_timer,audio1_html5_AuthorTitle,audio1_html5_AuthorTitleInside,audio1_html5_next_btn,audio1_html5_Audio)
			});
		    	
			
			//initialize first Audio
			changeSrc(current_obj,options,thumbsHolder_Thumbs,thumbsHolder_Thumb,audio1_html5_sliderVertical,audio1_html5_thumbsHolder,audio1_html5_container,audio1_html5_play_btn,audio1_html5_Audio_seek,audio1_html5_Audio_buffer,audio1_html5_Audio_timer,audio1_html5_AuthorTitle,audio1_html5_AuthorTitleInside,audio1_html5_Audio);
			current_obj.timeupdateInterval=setInterval(function(){
					//alert (document.getElementById(current_obj.audioID).currentTime);
					seekUpdate(current_obj,options,audio1_html5_container,audio1_html5_Audio_seek,audio1_html5_Audio_buffer,audio1_html5_Audio_timer,audio1_html5_play_btn,audio1_html5_Audio,audio1_html5_AuthorTitle,audio1_html5_AuthorTitleInside);
    		},300);	
			
			document.getElementById(current_obj.audioID).addEventListener("durationchange", function() {
				if (current_obj.is_changeSrc) {
					current_obj.totalTime = document.getElementById(current_obj.audioID).duration;
				}
			});
			
			if (val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1) {
				document.getElementById(current_obj.audioID).addEventListener("canplaythrough", function() {
					if (current_obj.totalTime != document.getElementById(current_obj.audioID).duration) {
						//seekbar init
						if (options.isSliderInitialized) {
							audio1_html5_Audio_seek.slider("destroy");
							options.isSliderInitialized=false;
						}
						if (options.isProgressInitialized) {
							audio1_html5_Audio_buffer.progressbar("destroy");
							options.isProgressInitialized=false;
						}
				
						current_obj.totalTime = document.getElementById(current_obj.audioID).duration;
						generate_seekBar(current_obj,options,audio1_html5_container,audio1_html5_Audio_seek,audio1_html5_Audio_buffer,audio1_html5_Audio_timer,audio1_html5_play_btn,audio1_html5_Audio);
						if (options.isProgressInitialized) {	
							audio1_html5_Audio_buffer.progressbar({ value: current_obj.audioPlayerWidth });
						}
					}
				});	
			}

		});
	};


	//
	// plugin customization variables
	//
	$.fn.audio1_html5.defaults = {
			skin: 'whiteControllers',
			initialVolume:0.5,
			autoPlay:false,
			loop:true,			
			playerPadding: 5,
			playerBg: '#000000',
			bufferEmptyColor: '#929292',
			bufferFullColor: '#454545',
			seekbarColor: '#ffffff',
			volumeOffColor: '#454545',
			volumeOnColor: '#ffffff',
			timerColor: '#ffffff',
			songAuthorTitleColor: '#fffff',
			
			showRewindBut:true,
			showPlayBut:true,
			showPreviousBut:true,
			showNextBut:true,
			showPlaylistBut:true,
			showVolumeBut:true,
			showVolumeSliderBut:true,
			showTimer:true,
			showSeekBar:true,
			showAuthor:true,
			showTitle:true,
			showPlaylist:true,
			showPlaylistOnInit:true,

			playlistTopPos:2,
			playlistBgColor:'#000000',
			playlistRecordBgOffColor:'#000000',
			playlistRecordBgOnColor:'#333333',
			playlistRecordBottomBorderOffColor:'#333333',
			playlistRecordBottomBorderOnColor:'#FFFFFF',
			playlistRecordTextOffColor:'#777777',
			playlistRecordTextOnColor:'#FFFFFF',
			numberOfThumbsPerScreen:7,	
			playlistPadding:4,
			showPlaylistNumber:true,
			isSliderInitialized:false,
			isProgressInitialized:false

	};

})(jQuery);