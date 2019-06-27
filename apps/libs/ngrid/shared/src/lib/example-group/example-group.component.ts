import { map, first, filter } from 'rxjs/operators';
import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { ExampleGroupRegistryService } from './example-group-registry.service';

@Component({
  selector: 'pbl-example-group',
  templateUrl: './example-group.component.html',
  styleUrls: [ './example-group.component.scss' ]
})
export class ExampleGroupComponent {
  /**
   * When set, will insert a link to the root URL for this example group
   */
  @Input() hasHomePage: boolean;

  constructor(public registry: ExampleGroupRegistryService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const hasHomePage = coerceBooleanProperty(this.hasHomePage);
    if (!hasHomePage) {

      this.registry.groups
        .pipe(
          filter( groups => !!groups[0].examples[0] ),
          first(),
        )
        .subscribe( groups => {
          let last = this.route.snapshot.pathFromRoot.pop();
          while (last.firstChild) {
            last = last.firstChild;
          }
          const path = last.routeConfig.path;
          const example = groups.map( g => g.examples.find( e => e.id === path )).filter( e => !!e)[0]
          if (!example) {
            const group = groups[0].examples[0];
            this.router.navigate(group.routerLink, { relativeTo: this.route });
          }
        });
    }
  }
}
