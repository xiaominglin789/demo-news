<div class="com-list-item list-3" data-page="{{ pageNum }}" data-index="{{ index }}"  data-uniquekey="{{ uniquekey }}"  data-url="{{ url }}">
    <p class="title">{{ title }}</p>
    <div class="imgs">
        <img src="<%= require('../../../assets/img/loading.gif') %>" data-img="{{ thumbnail_pic_s }}" class="list-img"/>
        <img src="<%= require('../../../assets/img/loading.gif') %>" data-img="{{ thumbnail_pic_s02 }}" class="list-img"/>
        <img src="<%= require('../../../assets/img/loading.gif') %>" data-img="{{ thumbnail_pic_s03 }}" class="list-img"/>
    </div>
    <div class="info">
        <p class="author">{{ author }}</p>
        <p class="date">{{ date }}</p>
    </div>
</div>