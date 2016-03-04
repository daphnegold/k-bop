import {Page, ViewController, NavParams} from 'ionic-framework/ionic';
import {FormBuilder, ControlGroup, Validators, AbstractControl} from 'angular2/common';
import {Song} from '../../song';
import {CommentService} from '../../comment.service';

@Page({
  templateUrl: 'build/pages/comments/comments.html',
  providers: [CommentService]
})
export class CommentsModal {
  commentForm: ControlGroup;
  comment: AbstractControl;
  song: Song;
  // active: boolean = true;

  constructor(private viewCtrl: ViewController,
    private params: NavParams,
    private form: FormBuilder,
    private _commentService: CommentService) {

    this.song = this.params.get('mySong');

    this.commentForm = form.group({
      comment: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(140)])]
    })

    this.comment = this.commentForm.controls['comment'];
  }

  addComment(comment) {
    this._commentService.addComment(this.song, comment)
      .subscribe(
        data => {
          console.log("Server response:")
          console.log(data)
        },
        error => { console.log(<any>error); alert("Something has gone wrong, please try again later"); }
      );
   }

  onSubmit(value: string) {
    if(this.commentForm.valid) {
      this.addComment(value["comment"]);
      this.song.comments.push(value["comment"]);

      console.log('Submitted value: ', value);
      this.dismiss();
      // this.active = false;
      // setTimeout(()=> this.active = true, 0);
    }
  }

  // onSubmit() { this.submitted = true; }

  dismiss() { this.viewCtrl.dismiss(); }
}
