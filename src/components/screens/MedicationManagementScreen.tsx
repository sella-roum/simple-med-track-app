
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pill, Edit, Trash2 } from 'lucide-react';

export const MedicationManagementScreen = () => {
  const { toast } = useToast();
  
  const [medications, setMedications] = useState([
    { id: 1, name: 'ロキソニン錠60mg', dosage: '1錠', memo: '朝食後に服用。胃の負担を軽減するため' },
    { id: 2, name: 'ガスター錠20mg', dosage: '1錠', memo: '胃の保護のため。空腹時でも可' },
    { id: 3, name: 'ムコダイン錠250mg', dosage: '2錠', memo: '水分多めに摂取。のどの痰を出しやすくする' }
  ]);

  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    memo: ''
  });
  
  const [editingMedication, setEditingMedication] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage) {
      toast({
        title: "エラー",
        description: "薬剤名と用法・用量は必須項目です。",
        variant: "destructive",
      });
      return;
    }

    const medication = {
      id: Date.now(),
      ...newMedication
    };

    setMedications(prev => [...prev, medication]);
    setNewMedication({ name: '', dosage: '', memo: '' });
    setIsAddDialogOpen(false);

    toast({
      title: "追加完了",
      description: `${medication.name} を追加しました。`,
    });
  };

  const handleEditMedication = () => {
    if (!editingMedication.name || !editingMedication.dosage) {
      toast({
        title: "エラー",
        description: "薬剤名と用法・用量は必須項目です。",
        variant: "destructive",
      });
      return;
    }

    setMedications(prev => 
      prev.map(med => 
        med.id === editingMedication.id ? editingMedication : med
      )
    );
    
    setEditingMedication(null);
    setIsEditDialogOpen(false);

    toast({
      title: "更新完了",
      description: "薬剤情報を更新しました。",
    });
  };

  const handleDeleteMedication = (id: number) => {
    setMedications(prev => prev.filter(med => med.id !== id));
    
    toast({
      title: "削除完了",
      description: "薬剤を削除しました。",
    });
  };

  const openEditDialog = (medication: any) => {
    setEditingMedication({ ...medication });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">薬剤管理</h2>
        <p className="text-sm sm:text-base text-gray-600">服用中の薬剤を管理できます</p>
      </div>

      {/* 薬剤追加ボタン */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            新しい薬剤を追加
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">薬剤追加</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">薬剤名 *</Label>
              <Input
                placeholder="例: ロキソニン錠60mg"
                value={newMedication.name}
                onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                className="border-blue-200 focus:border-blue-500"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">用法・用量 *</Label>
              <Input
                placeholder="例: 1錠"
                value={newMedication.dosage}
                onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                className="border-blue-200 focus:border-blue-500"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">メモ</Label>
              <Textarea
                placeholder="服用時の注意点など..."
                value={newMedication.memo}
                onChange={(e) => setNewMedication(prev => ({ ...prev, memo: e.target.value }))}
                className="resize-none border-blue-200 focus:border-blue-500"
                rows={3}
              />
            </div>
            <Button 
              onClick={handleAddMedication}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
            >
              追加
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 薬剤一覧 */}
      <div className="space-y-3 sm:space-y-4">
        {medications.map((medication) => (
          <Card key={medication.id} className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Pill className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{medication.name}</h3>
                  </div>
                  <p className="text-blue-600 font-medium text-xs sm:text-sm mb-2">用法・用量: {medication.dosage}</p>
                  {medication.memo && (
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      💡 {medication.memo}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openEditDialog(medication)}
                        className="border-blue-200 text-blue-600 hover:bg-blue-50 text-xs sm:text-sm px-2 sm:px-3"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        編集
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-base sm:text-lg">薬剤編集</DialogTitle>
                      </DialogHeader>
                      {editingMedication && (
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">薬剤名 *</Label>
                            <Input
                              value={editingMedication.name}
                              onChange={(e) => setEditingMedication(prev => ({ ...prev, name: e.target.value }))}
                              className="border-blue-200 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">用法・用量 *</Label>
                            <Input
                              value={editingMedication.dosage}
                              onChange={(e) => setEditingMedication(prev => ({ ...prev, dosage: e.target.value }))}
                              className="border-blue-200 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">メモ</Label>
                            <Textarea
                              value={editingMedication.memo}
                              onChange={(e) => setEditingMedication(prev => ({ ...prev, memo: e.target.value }))}
                              className="resize-none border-blue-200 focus:border-blue-500"
                              rows={3}
                            />
                          </div>
                          <Button 
                            onClick={handleEditMedication}
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                          >
                            保存
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50 text-xs sm:text-sm px-2 sm:px-3"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        削除
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-[95vw] max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-base">薬剤を削除しますか？</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm">
                          この操作は取り消せません。本当に削除しますか？
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="text-sm">キャンセル</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteMedication(medication.id)}
                          className="bg-red-600 hover:bg-red-700 text-sm"
                        >
                          削除
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {medications.length === 0 && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
          <CardContent className="p-6 sm:p-8 text-center">
            <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-sm sm:text-base">まだ薬剤が登録されていません</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">上のボタンから薬剤を追加してください</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
