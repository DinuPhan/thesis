@extends('index')
@section('extra-style')
	{{Html::style('custom/css/homepage/homepage_style.css')}}
@endsection

@section('contents')
	<div class="container-fluid">
		<div class="welcome-page">
			<div class="header">Chào mừng tới BooLo</div>
			<p>
				BooLo là ứng dụng được thiết kế dùng để hỗ trợ các bạn trong
				quá trình học và làm quen với các bài tập thuộc chương "Logic" và "Đại số Bool và Hàm Bool" -  Toán cao cấp hệ Cao Đẳng/ Đại Học.
			</p>
			<p>
				Bằng việc tham khảo và sử dụng BooLo, mong rằng ứng dụng sẽ giúp bạn thấy môn Toán cao cấp "phần nào" nhẹ nhàng hơn.
			</p>
			<p>
				Nếu bạn muốn tìm hiểu thêm về các thao tác với giao diện, hãy xem video dưới đây:
			</p>
			<div style="text-align:center;">
				<iframe width="420" height="315" src="https://www.youtube.com/embed/tgbNymZ7vqY"></iframe>
			</div>
		</div>
	</div>
@endsection
