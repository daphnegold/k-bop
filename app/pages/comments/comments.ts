import {Page, ViewController, NavParams} from 'ionic-framework/ionic';
import {FormBuilder, ControlGroup, Validators, AbstractControl} from 'angular2/common';
import {Song} from '../../song';

@Page({
  templateUrl: 'build/pages/comments/comments.html',
})
export class CommentsModal {
  commentForm: ControlGroup;
  comment: AbstractControl;
  song: Song;
  // active: boolean = true;

  constructor(private viewCtrl: ViewController, private params: NavParams, private form: FormBuilder) {
    this.song = this.params.get('mySong');

    this.commentForm = form.group({
      comment: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(140)])]
    })

    this.comment = this.commentForm.controls['comment'];
  }

  onSubmit(value: string) {
    if(this.commentForm.valid) {
      console.log('Submitted value: ', value);
      this.dismiss();
      // this.active = false;
      // setTimeout(()=> this.active = true, 0);
    }
  }

  // onSubmit() { this.submitted = true; }

  dismiss() { this.viewCtrl.dismiss(); }
}
