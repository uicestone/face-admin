<template>
  <footer class="footer footer-black footer-white">
    <div class="container-fluid">
      <div class="row">
        <nav class="footer-nav">
          <ul>
            <!-- <li>
              <a href="https://www.creative-tim.com" target="_blank" rel="noopener">Creative Tim</a>
            </li>
            <li>
              <a href="http://blog.creative-tim.com/" target="_blank" rel="noopener">Blog</a>
            </li>
            <li>
              <a href="https://www.creative-tim.com/license" target="_blank" rel="noopener">Licenses</a>
            </li> -->
          </ul>
        </nav>
        <div class="credits ml-auto">
          <div class="copyright">
            &copy; {{ (new Date()).getFullYear() }} <a href="https://codeispoetry.tech">诗序软件</a>
            &nbsp;
            <span>Code is poetry.</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
  export default {
    name: 'main-footer'
  }
</script>
<style>
</style>
