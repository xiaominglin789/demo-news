<div class="com-list-item list-1" data-page="{{ pageNum }}" data-index="{{ index }}"  data-uniquekey="{{ uniquekey }}" data-url="{{ url }}">
    <div class="content">
        <p class="title">{{ title }}</p>
        <span class="info">
            <p class="author">{{ author }}</p>
            <p class="date">{{ date }}</p>
        </span>
    </div>
    <img src="<%= require('../../../assets/img/loading.gif') %>" data-img="{{ thumbnail_pic_s }}" class="list-img"/>
</div>