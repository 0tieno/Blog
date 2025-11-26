---
layout: page
title: Archives
permalink: /archives/
---

{% assign count = site.posts | size %}

## Total ({{ count }} Posts)

{% assign oldest_post = site.posts | last %}
{% assign oldest_date = oldest_post.date %}
{% assign postsByYear = site.posts | group_by_exp:"post", "post.date | date: '%Y'" %}
{% for year in postsByYear %}
{% assign yearCount = year.items | size %}

### {{ year.name }} ({{yearCount}} Posts)

{% assign postsByMonth = year.items | group_by_exp:"post", "post.date | date: '%B'" %}

{% for month in postsByMonth %}
{% assign monthCount = month.items | size %}

### {{ month.name }} {{ year.name }} ({{monthCount}} Posts)

{% comment %} Calculate weeks based on days since Nov 5, 2025 (baseline) {% endcomment %}
{% assign baseline_date = '2025-11-05' | date: '%s' %}
{% assign postsByWeek = month.items | group_by_exp:"post", "post.date | date: '%s' | minus: baseline_date | divided_by: 86400 | divided_by: 7 | floor | plus: 1" %}

{% for week in postsByWeek %}

#### 📅 Week {{week.name}}

  <ol reversed type="i">
  {% for post in week.items %}
    <li>
      <a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a> - {{ post.date | date: "%A, %-d %B %Y" }} <h5><b>{% if post.categories and post.categories.size > 0 %}
  [{{ post.categories | join: ", " }}]
{% else %}
  []
{% endif %}</b></h5>
    </li>
  {% endfor %}
  </ol>
{% endfor %}
{% endfor %}
{% endfor %}
