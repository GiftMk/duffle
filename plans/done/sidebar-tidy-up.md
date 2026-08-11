I want to essentially remove the tanstack router peer dependency from the UI package. to do this I want to introduce a new SidebarContext component (note we're using react 19
so no need for providers) and this should have things like a navigate function (it's okay for it to be weakly typed strings) and a getCurrentPathname function. Then the
consuming apps can pass these in from hooks. To really kill the dependency the useGithubAuth hook is also relying oon it, here for the callback urls its fine to just pass
weakly typed strings here
