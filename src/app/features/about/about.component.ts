import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealAnimationDirective } from '../../shared/directives/reveal-animation.directive';

interface ValueCard {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealAnimationDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  values: ValueCard[] = [
    {
      icon: 'pi-heart',
      title: 'Passion',
      description: 'Nous mettons tout notre savoir-faire pour choisir des modèles qui plaisent et qui durent.'
    },
    {
      icon: 'pi-eye',
      title: 'Exigence',
      description: 'Chaque monture est sélectionnée avec soin, du design jusqu à la qualité du matériau.'
    },
    {
      icon: 'pi-users',
      title: 'Proximité',
      description: 'Un service client réactif et une écoute sincère. Vous êtes au cœur de tout ce que nous faisons.'
    }
  ];

  stats = [
    { value: '7+', label: 'Modèles uniques' },
    { value: '100%', label: 'Clients satisfaits' },
    { value: '4.9/5', label: 'Note moyenne' },
    { value: '24h', label: 'Réponse garantie' }
  ];
}