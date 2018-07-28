<template>
  <div id="app">
    <section class="section">
      {{activeTab$}}
      <b-tabs v-model="activeTab">
        <b-tab-item v-for="people in people$" :key='people.id' :label='people.name'></b-tab-item>
      </b-tabs>
      <h2 class="title">{{name$}}</h2>
      <img v-stream:error='imageError$' :src="image$" alt="" class="img">
    </section>
  </div>
</template>

<script>
  import { memoizeWith, identity } from 'ramda';
  import { Observable, from, of , interval, combineLatest, merge } from 'rxjs'
  import { pluck, map, exhaustMap, concatMap, mergeMap, startWith, mapTo, switchMapTo, switchMap, catchError, share, } from 'rxjs/operators'

  export default {
    name: 'app',
    domStreams: ['click$', 'imageError$'],
    data: () => ({
      activeTab: 0,
    }),
    subscriptions() {
      // :: url => Observable
      const fetch = memoizeWith(identity, url => from(this.$http.get(url)).pipe(pluck('data')));

      const people$ = fetch('https://starwars.egghead.training/people');

      const activeTab$ = this.$watchAsObservable('activeTab', {immediate: true}).pipe(pluck('newValue'))

      const person$ = combineLatest(activeTab$, people$, (tabId, peoples) => peoples[tabId].id).pipe(
        map(id => `https://starwars.egghead.training/people/${id}`),
        switchMap(fetch),
        catchError(_ => fetch(`https://starwars.egghead.training/people/1`)),
        share()
      );
      const name$ = person$.pipe(pluck('name'));
      const imageLoad$ = person$.pipe(
        pluck('image'),
        map(src => `https://starwars.egghead.training/${src}`)
      );
      const imageFail$ = this.imageError$.pipe(mapTo('http://via.placeholder.com/400x400'));

      const image$ = merge(imageLoad$, imageFail$);
      return {
        activeTab$,
        people$,
        name$,
        image$
      }
    }
  }

</script>

<style>


</style>
